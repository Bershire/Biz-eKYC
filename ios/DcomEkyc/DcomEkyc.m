#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(EkycModule, RCTEventEmitter)
RCT_EXTERN_METHOD(initialize:(NSString *)appId signature:(NSString *)signature serverURL:(NSString *)serverURL)
RCT_EXTERN_METHOD(startEkyc:(NSString *)language)
@end
