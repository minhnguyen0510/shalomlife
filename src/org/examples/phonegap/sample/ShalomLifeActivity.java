package org.examples.phonegap.sample;


//import android.app.Activity;
import android.os.Bundle;
import org.apache.cordova.*;
import org.examples.phonegap.sample.R;
public class ShalomLifeActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);        
        
        //super.setStringProperty("loadingDialog", "Starting your app...");
        super.setIntegerProperty("splashscreen", R.drawable.shalomlife);
        super.loadUrl("file:///android_asset/www/index.html",5000);
//        setContentView(R.layout.main);
    }
}