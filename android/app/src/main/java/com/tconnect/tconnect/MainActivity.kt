package com.bizekyc.bizekyc

import android.content.Intent
import android.content.res.Configuration
import android.os.Build
import android.os.Bundle
import androidx.core.view.WindowCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.modules.core.DeviceEventManagerModule

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "TConnect"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
    DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null) // https://github.com/software-mansion/react-native-screens#android

    WindowCompat.setDecorFitsSystemWindows(window, false) // edge-to-edge style
  }

  override fun onStart() {
    super.onStart()

    val reactContext = reactInstanceManager.currentReactContext
    reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      ?.emit("AndroidActivityStart", null)
  }

  override fun onStop() {
    super.onStop()

    val reactContext = reactInstanceManager.currentReactContext
    reactContext?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      ?.emit("AndroidActivityStop", null)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    super.onConfigurationChanged(newConfig)

    val intent = Intent("onConfigurationChanged")
    intent.putExtra("newConfig", newConfig)
    this.sendBroadcast(intent)
  }

  // onelink: https://github.com/AppsFlyerSDK/appsflyer-react-native-plugin/blob/master/Docs/RN_DeepLinkIntegrate.md#android-deeplink-setup
  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
  }

  /**
   * Align the back button behavior with Android S
   * where moving root activities to background instead of finishing activities.
   * @see [](https://developer.android.com/reference/android/app/Activity.onBackPressed
  ) */
  override fun invokeDefaultOnBackPressed() {
    if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
      if (!moveTaskToBack(false)) {
        // For non-root activities, use the default implementation to finish them.
        super.invokeDefaultOnBackPressed()
      }
      return
    }

    // Use the default back button implementation on Android S
    // because it's doing more than {@link Activity#moveTaskToBack} in fact.
    super.invokeDefaultOnBackPressed()
  }
}
