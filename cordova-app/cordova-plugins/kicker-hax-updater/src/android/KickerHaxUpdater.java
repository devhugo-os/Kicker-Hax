package com.kickerhax.updater;

import android.app.DownloadManager;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;

import java.util.concurrent.atomic.AtomicBoolean;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;


public class KickerHaxUpdater extends CordovaPlugin {
  private static final long DOWNLOAD_TIMEOUT_MS = 180000L;
  private static final int UPDATE_NOTIFICATION_PERMISSION = 7011;
  private static final String UPDATE_CHANNEL_ID = "kicker_hax_updates";
  private static final String UPDATE_PREFS = "kicker_hax_updater";
  private static final String LAST_DOWNLOAD_ID = "last_download_id";
  private static final String LAST_ATTEMPT_AT = "last_attempt_at";
  private static final String LAST_NOTIFIED_VERSION = "last_notified_version";
  private static final long RETRY_COOLDOWN_MS = 10000L;
  private static final AtomicBoolean UPDATE_IN_PROGRESS = new AtomicBoolean(false);
  private String pendingUpdateVersion;
  private CallbackContext pendingNotificationCallback;
  private boolean pendingUpdateNotification;

  @Override
  protected void pluginInitialize() {
    super.pluginInitialize();
    UpdateCheckReceiver.schedule(cordova.getContext());
  }

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
    if ("prepareNotifications".equals(action)) {
      pendingUpdateNotification = false;
      requestNotificationPermission(callbackContext);
      return true;
    }
    if ("notifyUpdate".equals(action)) {
      notifyUpdate(args.optString(0, ""), callbackContext);
      return true;
    }
    if (!"downloadAndInstall".equals(action)) return false;

    final String downloadUrl = args.optString(0, "").trim();
    if (downloadUrl.isEmpty()) {
      callbackContext.error("URL da atualização ausente.");
      return true;
    }

    if (!UPDATE_IN_PROGRESS.compareAndSet(false, true)) {
      callbackContext.error("Uma atualização já está sendo baixada.");
      return true;
    }
    android.content.SharedPreferences prefs = cordova.getContext().getSharedPreferences(UPDATE_PREFS, android.content.Context.MODE_PRIVATE);
    long lastAttempt = prefs.getLong(LAST_ATTEMPT_AT, 0L);
    if (System.currentTimeMillis() - lastAttempt < RETRY_COOLDOWN_MS) {
      UPDATE_IN_PROGRESS.set(false);
      callbackContext.error("Aguarde 10 segundos antes de tentar novamente.");
      return true;
    }
    prefs.edit().putLong(LAST_ATTEMPT_AT, System.currentTimeMillis()).apply();
    cordova.getThreadPool().execute(() -> downloadAndInstall(downloadUrl, callbackContext));
    return true;
  }

  private void notifyUpdate(String version, CallbackContext callbackContext) {
    pendingUpdateNotification = true;
    pendingUpdateVersion = version;
    if (!requestNotificationPermission(callbackContext)) return;
    postUpdateNotification(version);
    callbackContext.success();
  }

  private boolean requestNotificationPermission(CallbackContext callbackContext) {
    if (Build.VERSION.SDK_INT >= 33 && cordova.getActivity().checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
      pendingNotificationCallback = callbackContext;
      cordova.getActivity().requestPermissions(new String[] { Manifest.permission.POST_NOTIFICATIONS }, UPDATE_NOTIFICATION_PERMISSION);
      return false;
    }
    return true;
  }

  @Override
  public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults) throws JSONException {
    super.onRequestPermissionResult(requestCode, permissions, grantResults);
    if (requestCode != UPDATE_NOTIFICATION_PERMISSION) return;
    if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED && pendingUpdateNotification) postUpdateNotification(pendingUpdateVersion);
    if (pendingNotificationCallback != null) pendingNotificationCallback.success();
    pendingNotificationCallback = null;
    pendingUpdateVersion = null;
    pendingUpdateNotification = false;
  }

  private void postUpdateNotification(String version) {
    android.content.SharedPreferences prefs = cordova.getContext().getSharedPreferences(UPDATE_PREFS, android.content.Context.MODE_PRIVATE);
    String normalizedVersion = version == null ? "" : version.trim();
    if (!normalizedVersion.isEmpty() && normalizedVersion.equals(prefs.getString(LAST_NOTIFIED_VERSION, ""))) return;
    NotificationManager manager = (NotificationManager) cordova.getContext().getSystemService(android.content.Context.NOTIFICATION_SERVICE);
    if (manager == null) return;
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      NotificationChannel channel = new NotificationChannel(UPDATE_CHANNEL_ID, "Atualizações do Kicker Hax", NotificationManager.IMPORTANCE_DEFAULT);
      manager.createNotificationChannel(channel);
    }
    Intent launchIntent = cordova.getContext().getPackageManager().getLaunchIntentForPackage(cordova.getContext().getPackageName());
    PendingIntent pendingIntent = launchIntent == null ? null : PendingIntent.getActivity(cordova.getContext(), 0, launchIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    String suffix = version == null || version.isEmpty() ? "" : " " + version;
    Notification.Builder builder = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
      ? new Notification.Builder(cordova.getContext(), UPDATE_CHANNEL_ID)
      : new Notification.Builder(cordova.getContext());
    int notificationIcon = cordova.getContext().getResources().getIdentifier("kicker_hax_notification_icon", "drawable", cordova.getContext().getPackageName());
    builder.setSmallIcon(notificationIcon != 0 ? notificationIcon : cordova.getContext().getApplicationInfo().icon)
      .setLargeIcon(android.graphics.BitmapFactory.decodeResource(cordova.getContext().getResources(), cordova.getContext().getApplicationInfo().icon))
      .setContentTitle("Tem reforço chegando ao Kicker Hax!")
      .setContentText("A versão" + suffix + " trouxe um HUD renovado. Toque para entrar em campo!")
      .setAutoCancel(true);
    if (pendingIntent != null) builder.setContentIntent(pendingIntent);
    manager.notify(5506, builder.build());
    if (!normalizedVersion.isEmpty()) prefs.edit().putString(LAST_NOTIFIED_VERSION, normalizedVersion).apply();
  }

  private void downloadAndInstall(String downloadUrl, CallbackContext callbackContext) {
    try {
      // Browser downloads succeed because Android's DownloadManager exposes a
      // public content URI. Reuse that exact provider instead of passing a
      // private cache FileProvider URI that some vendors reject as malformed.
      DownloadManager manager = (DownloadManager) cordova.getContext().getSystemService(android.content.Context.DOWNLOAD_SERVICE);
      if (manager == null) throw new IllegalStateException("Gerenciador de downloads indisponível.");
      android.content.SharedPreferences prefs = cordova.getContext().getSharedPreferences(UPDATE_PREFS, android.content.Context.MODE_PRIVATE);
      long previousDownloadId = prefs.getLong(LAST_DOWNLOAD_ID, -1L);
      if (previousDownloadId != -1L) manager.remove(previousDownloadId);
      DownloadManager.Request request = new DownloadManager.Request(Uri.parse(downloadUrl));
      request.setTitle("Atualização do Kicker Hax");
      request.setDescription("Baixando a nova versão do jogo");
      request.setMimeType("application/vnd.android.package-archive");
      request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
      request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "KickerHax/kicker-hax-update.apk");
      long downloadId = manager.enqueue(request);
      prefs.edit().putLong(LAST_DOWNLOAD_ID, downloadId).apply();
      long deadline = System.currentTimeMillis() + DOWNLOAD_TIMEOUT_MS;
      int status = DownloadManager.STATUS_PENDING;
      int reason = 0;
      while (System.currentTimeMillis() < deadline) {
        DownloadManager.Query query = new DownloadManager.Query().setFilterById(downloadId);
        try (android.database.Cursor cursor = manager.query(query)) {
          if (cursor != null && cursor.moveToFirst()) {
            status = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_STATUS));
            reason = cursor.getInt(cursor.getColumnIndexOrThrow(DownloadManager.COLUMN_REASON));
            if (status == DownloadManager.STATUS_SUCCESSFUL || status == DownloadManager.STATUS_FAILED) break;
          }
        }
        Thread.sleep(400);
      }
      if (status != DownloadManager.STATUS_SUCCESSFUL) {
        throw new IllegalStateException("Download da atualização falhou (código " + reason + ").");
      }
      Uri apkUri = manager.getUriForDownloadedFile(downloadId);
      if (apkUri == null) throw new IllegalStateException("Android não disponibilizou o APK baixado.");
      cordova.getActivity().runOnUiThread(() -> openInstaller(apkUri, callbackContext));
    } catch (Exception error) {
      callbackContext.error(error.getMessage() == null ? "Falha ao baixar a atualização." : error.getMessage());
    } finally {
      UPDATE_IN_PROGRESS.set(false);
    }
  }

  /** Removes only the APK registered by this updater after Android replaces the app. */
  public static void cleanupDownloadedApk(android.content.Context context) {
    android.content.SharedPreferences prefs = context.getSharedPreferences(UPDATE_PREFS, android.content.Context.MODE_PRIVATE);
    long downloadId = prefs.getLong(LAST_DOWNLOAD_ID, -1L);
    if (downloadId != -1L) {
      DownloadManager manager = (DownloadManager) context.getSystemService(android.content.Context.DOWNLOAD_SERVICE);
      if (manager != null) manager.remove(downloadId);
    }
    java.io.File updateFile = new java.io.File(
      Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS),
      "KickerHax/kicker-hax-update.apk"
    );
    if (updateFile.exists()) updateFile.delete();
    java.io.File updateDirectory = updateFile.getParentFile();
    String[] remainingFiles = updateDirectory == null ? null : updateDirectory.list();
    if (remainingFiles != null && remainingFiles.length == 0) updateDirectory.delete();
    prefs.edit().remove(LAST_DOWNLOAD_ID).remove(LAST_ATTEMPT_AT).apply();
  }

  private void openInstaller(Uri apkUri, CallbackContext callbackContext) {
    try {
      PackageManager packageManager = cordova.getContext().getPackageManager();
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && !packageManager.canRequestPackageInstalls()) {
        Intent settingsIntent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
        settingsIntent.setData(Uri.parse("package:" + cordova.getContext().getPackageName()));
        cordova.getActivity().startActivity(settingsIntent);
        callbackContext.error("Autorize instalações deste app e toque em Atualizar novamente.");
        return;
      }

      Intent installerIntent = new Intent(Intent.ACTION_VIEW);
      installerIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
      installerIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
      cordova.getActivity().startActivity(installerIntent);
      callbackContext.success();
    } catch (Exception error) {
      callbackContext.error(error.getMessage() == null ? "Não foi possível abrir o instalador Android." : error.getMessage());
    }
  }
}
