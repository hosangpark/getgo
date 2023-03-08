#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import <GoogleMaps/GoogleMaps.h>

@implementation AppDelegate
...

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
+  [GMSServices provideAPIKey:@"AIzaSyCiUoFcfZ7Lt2gmTHKMuFKDubxyDg2WiLE"]; // add this line using the api key obtained from Google Console

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate>

@property (nonatomic, strong) UIWindow *window;

@end
