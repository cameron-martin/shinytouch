__all__=['callibrate', 'graphics', 'performance', 'perspective', 'tracker']

from opencv.highgui import *
from opencv.cv import *

import shinytouch
import callibrate, config, graphics, performance, perspective, tracker

# Change Mode slider
def change_mode(position):
	global mode
	mode=position

# Motion threshold slider
def change_threshold(thresh):
	global motion_threshold
	motion_threshold=thresh

# Universal function for handling a click
def handleclick(event, x, y, flags, param):
    global mode
    if mode==4 and event==CV_EVENT_LBUTTONDOWN: # Callibrate Mode
        callibrate.click(x, y)

# Make window & set click handler
cvNamedWindow(config.window_name, 1)
cvSetMouseCallback(config.window_name, shinytouch.handleclick);

# Open Camera
camera = cvCreateCameraCapture(config.camnum)
cvSetCaptureProperty(camera, CV_CAP_PROP_FRAME_WIDTH, config.width)
cvSetCaptureProperty(camera, CV_CAP_PROP_FRAME_HEIGHT, config.height)

mode=0 # Normal Mode

# Create Mode Slider
cvCreateTrackbar("Mode", config.window_name, 0, 4, shinytouch.change_mode);

# Create Motion threshold slider
motion_threshold=0
cvCreateTrackbar("Threshold", config.window_name, 0, 255, shinytouch.change_threshold);

running=True

lastframe=cvQueryFrame(camera)

try:
	# Main Loop.
	while running:
		
		# Get Frame
		frame = cvQueryFrame(camera)
		
		if mode==0: # Normal Mode
			pass
			frame=graphics.draw_mode(frame,"Normal")
			frame=graphics.drawquad(frame)
			
		elif mode==1: # Transform Mode
			frame = perspective.warp(frame)
			frame = graphics.draw_mode(frame,"Transform")
		
		elif mode==2 or mode==3: # Track/effects Mode
			# Warp the frame
			frame=perspective.warp(frame)
			
			# Preserve the frame
			preserved_frame=cvCloneImage(frame)
			
			# Filter out the motion
			frame=shinytouch.tracker.filter_motion(frame, lastframe)
						
			# Make a copy
			lastframe=cvCloneImage(preserved_frame)
		
			if mode==2:
				frame=gfx.draw_mode(frame, "Motion Mode")
			elif mode==3:
				#print int(repr(frame.imageData[0])[3:-1], 16)
				frame=gfx.draw_mode(frame, "Track Mode")
		
		elif mode==4: # Callibrate Mode
			frame=gfx.callibration(frame, callib.clicks)
			frame=gfx.draw_mode(frame,"Callibrate Mode")
			frame=gfx.drawquad(frame)

		# Write FPS
		#frame = graphics.fps(frame, speed.go())
		
		# Post frame to window
		cvShowImage(config.window_name, frame)
		
		
		# Wait for 1ms (to stop freezing)
		cvWaitKey(2)
except KeyboardInterrupt:
	running=False
