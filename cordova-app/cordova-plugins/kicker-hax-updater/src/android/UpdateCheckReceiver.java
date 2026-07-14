package com.kickerhax.updater;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.Constraints;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;

import java.util.concurrent.TimeUnit;

/** Restores the persistent update worker after install, app launch or reboot. */
public final class UpdateCheckReceiver extends BroadcastReceiver {
  private static final String UNIQUE_WORK = "kicker_hax_background_update_check";

  public static void schedule(Context context) {
    Constraints constraints = new Constraints.Builder()
      .setRequiredNetworkType(NetworkType.CONNECTED)
      .build();
    PeriodicWorkRequest request = new PeriodicWorkRequest.Builder(
      UpdateCheckWorker.class,
      15,
      TimeUnit.MINUTES
    ).setConstraints(constraints).build();
    WorkManager.getInstance(context).enqueueUniquePeriodicWork(
      UNIQUE_WORK,
      ExistingPeriodicWorkPolicy.UPDATE,
      request
    );
  }

  @Override
  public void onReceive(Context context, Intent intent) {
    if (Intent.ACTION_MY_PACKAGE_REPLACED.equals(intent.getAction())) {
      KickerHaxUpdater.cleanupDownloadedApk(context);
    }
    schedule(context);
  }
}
