package com.kickerhax.updater;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.BitmapFactory;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

/** Performs a network-constrained release check even when the WebView is closed. */
public final class UpdateCheckWorker extends Worker {
  private static final int NOTIFICATION_ID = 5507;
  private static final String CHANNEL = "kicker_hax_updates";
  private static final String VERSION_URL = "https://devhugo-os.github.io/Kicker-Hax/deploy-version.txt";
  private static final String UPDATE_PREFS = "kicker_hax_updater";
  private static final String LAST_NOTIFIED_VERSION = "last_notified_version";

  public UpdateCheckWorker(@NonNull Context context, @NonNull WorkerParameters parameters) {
    super(context, parameters);
  }

  @NonNull
  @Override
  public Result doWork() {
    HttpURLConnection connection = null;
    try {
      connection = (HttpURLConnection) new URL(VERSION_URL + "?t=" + System.currentTimeMillis()).openConnection();
      connection.setConnectTimeout(7000);
      connection.setReadTimeout(7000);
      connection.setUseCaches(false);
      String line;
      try (BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
        line = reader.readLine();
      }
      String latest = line == null ? "" : line.replaceAll("[^0-9.]", "");
      Context context = getApplicationContext();
      String installed = context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionName;
      if (isNewer(latest, installed)) notifyUpdate(context, latest);
      return Result.success();
    } catch (Exception error) {
      return Result.retry();
    } finally {
      if (connection != null) connection.disconnect();
    }
  }

  private static boolean isNewer(String latest, String installed) {
    String[] remote = latest.split("\\.");
    String[] local = installed.split("\\.");
    for (int index = 0; index < Math.max(remote.length, local.length); index++) {
      int remotePart = index < remote.length ? Integer.parseInt(remote[index]) : 0;
      int localPart = index < local.length ? Integer.parseInt(local[index]) : 0;
      if (remotePart != localPart) return remotePart > localPart;
    }
    return false;
  }

  private static void notifyUpdate(Context context, String version) {
    if (Build.VERSION.SDK_INT >= 33 && context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) return;
    android.content.SharedPreferences prefs = context.getSharedPreferences(UPDATE_PREFS, Context.MODE_PRIVATE);
    if (version.equals(prefs.getString(LAST_NOTIFIED_VERSION, ""))) return;
    NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
    if (manager == null) return;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      manager.createNotificationChannel(new NotificationChannel(CHANNEL, "Atualizações do Kicker Hax", NotificationManager.IMPORTANCE_DEFAULT));
    }
    Intent launch = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
    PendingIntent open = launch == null ? null : PendingIntent.getActivity(context, NOTIFICATION_ID, launch, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    Notification.Builder builder = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O ? new Notification.Builder(context, CHANNEL) : new Notification.Builder(context);
    int smallIcon = context.getResources().getIdentifier("kicker_hax_notification_icon", "drawable", context.getPackageName());
    builder.setSmallIcon(smallIcon != 0 ? smallIcon : context.getApplicationInfo().icon)
      .setLargeIcon(BitmapFactory.decodeResource(context.getResources(), context.getApplicationInfo().icon))
      .setContentTitle("Tem reforço chegando ao Kicker Hax!")
      .setContentText("A bola fugiu para o vestiário. Atualize e traga ela de volta ao campo!")
      .setAutoCancel(true);
    if (open != null) builder.setContentIntent(open);
    manager.notify(NOTIFICATION_ID, builder.build());
    prefs.edit().putString(LAST_NOTIFIED_VERSION, version).apply();
  }
}
