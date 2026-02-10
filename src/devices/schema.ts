export const defaultSchema = [
  {
      "attr": 0,
      "code": "pump_control",
      "defaultValue": "",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 101,
      "mode": "rw",
      "name": "Pump Control",
      "passive": true,
      "property": {
          "maxlen": 128,
          "type": "raw"
      },
      "subType": "raw",
      "type": "raw"
  },
  {
      "attr": 4096,
      "code": "mcu_info",
      "defaultValue": "",
      "desc": "",
      "editPermission": false,
      "extContent": "",
      "iconname": "icon-dp_doc",
      "id": 102,
      "mode": "rw",
      "name": "MCU信息",
      "property": {
          "maxlen": 255,
          "type": "string"
      },
      "subType": "string",
      "type": "obj"
  },
  {
      "attr": 0,
      "code": "feature_speed",
      "defaultValue": "",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 104,
      "mode": "rw",
      "name": "Feature Speed",
      "passive": true,
      "property": {
          "maxlen": 128,
          "type": "raw"
      },
      "subType": "raw",
      "type": "raw"
  },
  {
      "attr": 0,
      "code": "device_all_status",
      "defaultValue": "",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 105,
      "mode": "rw",
      "name": "All Status",
      "passive": true,
      "property": {
          "maxlen": 128,
          "type": "raw"
      },
      "subType": "raw",
      "type": "raw"
  },
  {
      "attr": 0,
      "code": "device_supported_function",
      "defaultValue": "",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 106,
      "mode": "rw",
      "name": "device_supported_function",
      "passive": true,
      "property": {
          "maxlen": 128,
          "type": "raw"
      },
      "subType": "raw",
      "type": "raw"
  },
  {
      "attr": 0,
      "code": "svrs",
      "defaultValue": "",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 107,
      "mode": "rw",
      "name": "svrs",
      "passive": true,
      "property": {
          "maxlen": 128,
          "type": "raw"
      },
      "subType": "raw",
      "type": "raw"
  },
  {
      "attr": 0,
      "code": "no_flow",
      "defaultValue": "",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 108,
      "mode": "rw",
      "name": "No Flow Detection",
      "passive": true,
      "property": {
          "maxlen": 128,
          "type": "raw"
      },
      "subType": "raw",
      "type": "raw"
  },
  {
      "attr": 0,
      "code": "priming",
      "defaultValue": "",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 109,
      "mode": "rw",
      "name": "Priming",
      "passive": true,
      "property": {
          "maxlen": 128,
          "type": "raw"
      },
      "subType": "raw",
      "type": "raw"
  },
  {
      "attr": 0,
      "code": "frozen",
      "defaultValue": "",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 110,
      "mode": "rw",
      "name": "Freeze Protection",
      "passive": true,
      "property": {
          "maxlen": 128,
          "type": "raw"
      },
      "subType": "raw",
      "type": "raw"
  },
  {
      "attr": 0,
      "code": "no_load",
      "defaultValue": "",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 111,
      "mode": "rw",
      "name": "No Load detection",
      "passive": true,
      "property": {
          "maxlen": 128,
          "type": "raw"
      },
      "subType": "raw",
      "type": "raw"
  },
  {
      "attr": 0,
      "code": "running_status",
      "defaultValue": "false",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 112,
      "mode": "rw",
      "name": "Running Status",
      "passive": true,
      "property": {
          "type": "bool"
      },
      "subType": "bool",
      "type": "obj"
  },
  {
      "attr": 0,
      "code": "set_speed",
      "defaultValue": "0",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 113,
      "mode": "rw",
      "name": "Set Speed",
      "passive": true,
      "property": {
          "max": 3500,
          "min": 0,
          "scale": 0,
          "step": 1,
          "type": "value",
          "unit": ""
      },
      "subType": "value",
      "type": "obj"
  },
  {
      "attr": 0,
      "code": "selected_program",
      "defaultValue": "1",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 114,
      "mode": "rw",
      "name": "Selected Speed Program",
      "passive": true,
      "property": {
          "max": 3,
          "min": 1,
          "scale": 0,
          "step": 1,
          "type": "value",
          "unit": ""
      },
      "subType": "value",
      "type": "obj"
  },
  {
      "attr": 0,
      "code": "feature_speed_status",
      "defaultValue": "false",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 116,
      "mode": "rw",
      "name": "Feature Speed Status",
      "passive": true,
      "property": {
          "type": "bool"
      },
      "subType": "bool",
      "type": "obj"
  },
  {
      "attr": 0,
      "code": "no_flow_status",
      "defaultValue": "false",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 118,
      "mode": "rw",
      "name": "No Flow Status",
      "passive": true,
      "property": {
          "type": "bool"
      },
      "subType": "bool",
      "type": "obj"
  },
  {
      "attr": 0,
      "code": "priming_status",
      "defaultValue": "false",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 120,
      "mode": "rw",
      "name": "Priming Status",
      "passive": true,
      "property": {
          "type": "bool"
      },
      "subType": "bool",
      "type": "obj"
  },
  {
      "attr": 0,
      "code": "frozen_status",
      "defaultValue": "false",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 122,
      "mode": "rw",
      "name": "Freeze Protection Status",
      "passive": true,
      "property": {
          "type": "bool"
      },
      "subType": "bool",
      "type": "obj"
  },
  {
      "attr": 0,
      "code": "current_gpm",
      "defaultValue": "0",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 123,
      "mode": "rw",
      "name": "GPM",
      "passive": true,
      "property": {
          "max": 1000,
          "min": 0,
          "scale": 0,
          "step": 1,
          "type": "value",
          "unit": ""
      },
      "subType": "value",
      "type": "obj"
  },
  {
      "attr": 0,
      "code": "current_watt",
      "defaultValue": "0",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 124,
      "mode": "rw",
      "name": "Watt",
      "passive": true,
      "property": {
          "max": 2000,
          "min": 0,
          "scale": 0,
          "step": 1,
          "type": "value",
          "unit": ""
      },
      "subType": "value",
      "type": "obj"
  },
  {
      "attr": 0,
      "code": "fault_flag",
      "defaultValue": "false",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 125,
      "mode": "rw",
      "name": "Fault Flag",
      "passive": true,
      "property": {
          "type": "bool"
      },
      "subType": "bool",
      "type": "obj"
  },
  {
      "attr": 0,
      "code": "fault_code",
      "defaultValue": "0",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 126,
      "mode": "rw",
      "name": "Fault Code",
      "passive": true,
      "property": {
          "max": 80,
          "min": 0,
          "scale": 0,
          "step": 1,
          "type": "value",
          "unit": ""
      },
      "subType": "value",
      "type": "obj"
  },
  {
      "attr": 0,
      "code": "current_speed",
      "defaultValue": "0",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 128,
      "mode": "ro",
      "name": "Current Speed",
      "passive": true,
      "property": {
          "max": 3500,
          "min": 0,
          "scale": 0,
          "step": 1,
          "type": "value",
          "unit": ""
      },
      "subType": "value",
      "type": "obj"
  },
  {
      "attr": 0,
      "code": "schedule_setting",
      "defaultValue": "",
      "desc": "",
      "editPermission": false,
      "extContent": "{\"passive\":true}",
      "id": 127,
      "mode": "rw",
      "name": "Schedule Setting",
      "passive": true,
      "property": {
          "maxlen": 128,
          "type": "raw"
      },
      "subType": "raw",
      "type": "raw"
  }
] as const;
