import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {Platform} from '@ionic/angular';

import {AppComponent} from './app.component';
import {
    mockPlatform,
    mockPlatformReady,
    mockRouter,
    mockSplashScreen,
    mockStatusBar
} from './shared/__mocks__/index.spec';

describe('AppComponent', () => {

    let statusBarSpy, splashScreenSpy, platformSpy, routerSpy;

    beforeEach(async(() => {
        statusBarSpy = mockStatusBar;
        splashScreenSpy = mockSplashScreen;
        platformSpy = mockPlatform;
        routerSpy = mockRouter;

        TestBed.configureTestingModule({
            declarations: [AppComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                {provide: StatusBar, useValue: statusBarSpy},
                {provide: SplashScreen, useValue: splashScreenSpy},
                {provide: Platform, useValue: platformSpy},
                {provide: Router, useValue: routerSpy},
            ],
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });

    it('should initialize the app', async () => {
        TestBed.createComponent(AppComponent);
        expect(platformSpy.ready).toHaveBeenCalled();
        await mockPlatformReady;
        expect(statusBarSpy.styleDefault).toHaveBeenCalled();
        expect(splashScreenSpy.hide).toHaveBeenCalled();
    });

    // TODO: add more tests!

});
