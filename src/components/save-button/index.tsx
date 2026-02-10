import React, { useEffect, useState } from 'react';
import { Text, View, Button } from '@ray-js/ray';
import Strings from '@/i18n';

import styles from './index.module.less';

export const SaveButton = ({ onClick }) => {
  return (
    <View className={`${styles.contentContainer}`} style={{ marginTop: 0 }} >
      <Button
        className={`${styles.card} ${styles.cardSecondColor}`}
        style={{ padding: '18rpx 0 !important' }}
        onClick={ onClick }
      >
        <Text className={styles.desText1}>{Strings.getLang('Save')}</Text>
      </Button>
    </View>
  );
};
