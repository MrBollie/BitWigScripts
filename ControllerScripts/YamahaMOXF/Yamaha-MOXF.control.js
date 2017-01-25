loadAPI(1);

// Controller properties
host.defineController("Yamaha", "MOXF6/MOXF8", "1.0", 
    "48d487d0-df04-11e6-9598-0800200c9a66");

host.defineMidiPorts(5,5);
host.addDeviceNameBasedDiscoveryPair(
   ["Yamaha MOXF6/MOXF8 MIDI 1",
    "Yamaha MOXF6/MOXF8 MIDI 2",
    "Yamaha MOXF6/MOXF8 MIDI 3",
    "Yamaha MOXF6/MOXF8 MIDI 4",
    "Yamaha MOXF6/MOXF8 MIDI 5"
   ],
   ["Yamaha MOXF6/MOXF8 MIDI 1",
    "Yamaha MOXF6/MOXF8 MIDI 2",
    "Yamaha MOXF6/MOXF8 MIDI 3",
    "Yamaha MOXF6/MOXF8 MIDI 4",
    "Yamaha MOXF6/MOXF8 MIDI 5"
   ]
);
    

/**
* Initializes the controller
*/
function init() {
    // Map callbacks
    host.getMidiInPort(1).setMidiCallback(onMidiCtrl);
    host.getMidiInPort(4).setSysexCallback(onMidiSysEx);

    out5 = host.getMidiOutPor(4);

    // Map some stuff
    transport = host.createTransportSection();
    application = host.createApplication();
    cursorTrack = host.createCursorTrack(0, 0);
    primaryDevice = cursorTrack.createCursorDevice()

    out5.sendSysex("F0 43 10 7F 17 01 20 00 00 F7");
    sendTrackName("BitWig");

}


/**
* Reacts to messages on the control port
*/
function onMidiCtrl(status, data1, data2) {
    if (status == 144) {
        if (data1 == 0x5e && data2 == 0x7f) {
            transport.play();
        }
        else if (data1 == 0x5d && data2 == 0x7f) {
            transport.stop();
        }
        else if (data1 == 0x36 && data2 == 0x7f) {
            application.createInstrumentTrack(0);
            cursorTrack.selectFirst();
            application.getAction("show_insert_popup_browser").invoke();
        }
    }
}

/** Receives sysex messages from input 5
*/
function onMidiSysEx(data) {
    printMidi(data);
}

function sendTrackName( name ) {
    for ( var i=0; i<15; i++) {
        var c = i<name.length ? name.charCodeAt(i) : 0x20;
        out5.sendSysex("F0 43 10 7F 17 01 00 "+hexpad(i)+" "+hexpad(c)+" F7")
    }
}


/**
* Exit functions for cleanup
*/
function exit() {
}
