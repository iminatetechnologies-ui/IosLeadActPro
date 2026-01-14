import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
// import FirebaseCore
// import FirebaseMessaging
// import UserNotifications

@main
class AppDelegate: RCTAppDelegate
// , UNUserNotificationCenterDelegate   // COMMENTED
{

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
  ) -> Bool {

    // 🔥 Firebase init (COMMENTED)
    // if FirebaseApp.app() == nil {
    //   FirebaseApp.configure()
    // }

    // 🔔 Notification delegate (COMMENTED)
    // UNUserNotificationCenter.current().delegate = self
    // application.registerForRemoteNotifications()

    self.moduleName = "LeadActPro"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  override func bundleURL() -> URL! {
  #if DEBUG
    return RCTBundleURLProvider.sharedSettings()
      .jsBundleURL(forBundleRoot: "index", fallbackExtension: nil)
  #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
  #endif
  }

  // ✅ Pass APNs token to Firebase (COMMENTED)
  /*
  override func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    Messaging.messaging().apnsToken = deviceToken
    super.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
  }
  */

  // ❌ APNs failure log (OPTIONAL – COMMENTED)
  /*
  override func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    print("❌ APNs registration failed:", error)
  }
  */

  // 🔔 Foreground notification handling (COMMENTED)
  /*
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler:
      @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    completionHandler([.banner, .sound, .badge])
  }
  */
}
