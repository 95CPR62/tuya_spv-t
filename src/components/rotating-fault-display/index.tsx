import React, { useState, useEffect } from 'react';
import { View, Text } from '@ray-js/components';
import { FaultCode } from '@/constant';
import { myUtils } from '@/utils';
import Strings from '@/i18n';
import styles from './index.module.less';

interface FaultDisplayProps {
  fault_flag: boolean;
  fault_code: number;
}

export const RotatingFaultDisplay: React.FC<FaultDisplayProps> = ({ fault_flag, fault_code }) => {
  const [activeFaults, setActiveFaults] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update active faults when fault status changes
  useEffect(() => {
    if (fault_flag) {
      // Create a binary representation of the fault code
      // const faultBits = fault_code.toString(2).padStart(8, '0');
      const newFaults: number[] = [];
      
      // Check each fault condition
      // if (faultBits[7] === '1') newFaults.push(FaultCode.OverCurrent);
      // if (faultBits[6] === '1') newFaults.push(FaultCode.OverHeat);
      // if (faultBits[5] === '1') newFaults.push(FaultCode.UnderVoltage);
      // if (faultBits[4] === '1') newFaults.push(FaultCode.NoFlow);
      // if (faultBits[3] === '1') newFaults.push(FaultCode.SVRSDeteced);
      // if (faultBits[2] === '1') newFaults.push(FaultCode.LockRotorDetected);
      
      if(fault_code === FaultCode.OverCurrent) {
        newFaults.push(FaultCode.OverCurrent);
      } else if(fault_code === FaultCode.OverVoltage) {
        newFaults.push(FaultCode.OverVoltage);
      } else if(fault_code === FaultCode.OverHeat) {
        newFaults.push(FaultCode.OverHeat);
      } else if(fault_code === FaultCode.UnderVoltage) {
        newFaults.push(FaultCode.UnderVoltage);
      } else if(fault_code === FaultCode.NoFlow) {
        newFaults.push(FaultCode.NoFlow);
      } else if(fault_code === FaultCode.SVRSDeteced) {
        newFaults.push(FaultCode.SVRSDeteced);
      } else if(fault_code === FaultCode.LockRotorDetected) {
        newFaults.push(FaultCode.LockRotorDetected);
      }

      setActiveFaults(newFaults);
    } else {
      setActiveFaults([]);
    }
  }, [fault_flag, fault_code]);

  // Rotate through faults every 3 seconds
  useEffect(() => {
    if (activeFaults.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % activeFaults.length);
      }, 3000);

      return () => clearInterval(interval);
    } else {
      setCurrentIndex(0);
    }
  }, [activeFaults.length]);

  if (!fault_flag || activeFaults.length === 0) {
    return null;
  }

  return (
    <View className={styles.faultDisplayContainer}>
      <Text 
        className={`${styles.textStateAlert} ${styles.blinking}`}
      >
        {activeFaults.length > 1 ? `[${currentIndex + 1}/${activeFaults.length}] ` : ''}
        {myUtils.getFaultCodeLabel(activeFaults[currentIndex])}
      </Text>
      {/* {activeFaults.length > 1 && (
        <Text 
          className={`faultCounter`}
          style={{
            fontSize: '12px',
            position: 'absolute',
            bottom: '-20px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        >
          {`${currentIndex + 1}/${activeFaults.length}`}
        </Text>
      )} */}
    </View>
  );
}; 