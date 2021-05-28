import { Injectable } from '@angular/core'
import { HammerGestureConfig } from '@angular/platform-browser'

/**
 * @hidden
 * This class overrides the default Angular gesture config.
 */
@Injectable()
export class IonicGestureConfig extends HammerGestureConfig {
    private mc: any;
    buildHammer(element: HTMLElement) {
        if (window) {
            this.mc = new (<any>window).Hammer(element);

            for (const eventName in this.overrides) {
                if (eventName) {
                    this.mc.get(eventName).set(this.overrides[eventName]);
                }
            }
        }

        return this.mc;
    }
}
