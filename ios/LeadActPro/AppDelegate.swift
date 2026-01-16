import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import FirebaseCore
import FirebaseMessaging
import UserNotifications

@main
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate {

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {

    // 🔥 Initialize Firebase
    if FirebaseApp.app() == nil {
      FirebaseApp.configure()
    }

    // 🔔 Push Notification setup
    UNUserNotificationCenter.current().delegate = self
    application.registerForRemoteNotifications()

    // React Native setup
    self.moduleName = "LeadActPro"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // 📦 React Native bundle
  override func bundleURL() -> URL! {
  #if DEBUG
    return RCTBundleURLProvider.sharedSettings()
      .jsBundleURL(forBundleRoot: "index", fallbackExtension: nil)
  #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
  #endif
  }

  // ✅ APNs token → Firebase (DO NOT call super here)
  override func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    Messaging.messaging().apnsToken = deviceToken
  }

  // ❌ APNs registration failure
  override func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    print("❌ APNs registration failed:", error)
  }

  // 🔔 Show notification while app is in foreground
  func userNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler:
      @escaping (UNNotificationPresentationOptions) -> Void
  ) {
    completionHandler([.banner, .sound, .badge])
  }
}
