/* eslint-disable import/no-duplicates */
import React from 'react';
import 'ray';
import '@/i18n';
import '@/res/iconfont/iconfont.css';
import './app.less';
import { SdmProvider } from '@ray-js/panel-sdk';
import { authorize, getMobileDeviceInfo, initPanelEnvironment } from '@ray-js/ray';
import RayErrorCatch from '@ray-js/ray-error-catch';
import { devices } from '@/devices';
import Strings from '@/i18n';
import composeLayout from './composeLayout';
import { GDefine } from './constant';

interface Props {
  children: React.ReactNode;
}

initPanelEnvironment({ useDefaultOffline: true });
class App extends React.Component<Props> {
  componentDidMount() {
    console.log('=== App did mount');
    authorize({ scope: 'scope.userLocation' });

    // getMobileDeviceInfo({
    //   success(params) {
    //     console.log('windowWidth - ', params['windowWidth'])
    //     console.log('windowHeight - ', params['windowHeight'])
    //     GDefine.screenW = params['windowWidth']
    //     GDefine.screenH = params['windowHeight']
    //   },
    // })
  }

  render() {
    return (
      <RayErrorCatch
        errorTitle={Strings.getLang('errorTitle')}
        errorText={Strings.getLang('errorText')}
        submitText={Strings.getLang('submitText')}
      >
        <SdmProvider value={devices.common}>{this.props.children}</SdmProvider>
      </RayErrorCatch>
    );
  }
}

export default composeLayout(App);
