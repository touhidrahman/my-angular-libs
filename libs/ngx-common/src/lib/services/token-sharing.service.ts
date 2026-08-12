import { Injectable } from '@angular/core'

const TOKEN_SHARING_CHANNEL = 'ngx-common-token-sharing'
const REQUESTING_TOKEN = 'ngx-common-requesting-token'

/**
 * Syncs API tokens between newly opened tabs using BroadcastChannel API
 */
@Injectable({
    providedIn: 'root',
})
export class TokenSharingService {
    private bc = new BroadcastChannel(TOKEN_SHARING_CHANNEL)
    private accessTokenResolver: () => string = () => ''
    private refreshTokenResolver: () => string = () => ''
    private accessTokenSaver: (token: string) => void = () => {}
    private refreshTokenSaver: (token: string) => void = () => {}

    init(data: {
        accessTokenResolver: () => string
        refreshTokenResolver: () => string
        accessTokenSaver: (token: string) => void
        refreshTokenSaver: (token: string) => void
    }) {
        this.accessTokenResolver = data.accessTokenResolver
        this.refreshTokenResolver = data.refreshTokenResolver
        this.accessTokenSaver = data.accessTokenSaver
        this.refreshTokenSaver = data.refreshTokenSaver
        this.addBroadcastChannelListener()
        this.bc.postMessage(REQUESTING_TOKEN)
    }

    private addBroadcastChannelListener() {
        this.bc.addEventListener('message', (event) => {
            if (event.data === REQUESTING_TOKEN) {
                new BroadcastChannel(TOKEN_SHARING_CHANNEL).postMessage({
                    accessToken: this.accessTokenResolver(),
                    refreshToken: this.refreshTokenResolver(),
                })
            } else {
                const { accessToken, refreshToken } = event.data
                accessToken && this.accessTokenSaver(accessToken)
                refreshToken && this.refreshTokenSaver(refreshToken)
            }
        })
    }
}
