export const isRunningOnUnity = ():boolean => {
    return window.navigator.userAgent.indexOf('Chrome/100.0.4896.127') !== -1
}