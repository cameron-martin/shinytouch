    # Set up the perspective matrix
    import config
    from opencv.cv import *
    mmat = False
    self.update_matrix()

    def warp(frame):
        global mmat
        frame2 = cvCreateImage(cvGetSize(frame), frame.depth, frame.nChannels)
        cvWarpPerspective(frame, frame2, mmat)
        return frame2

    def update_matrix():
        global mmat
        
        mmat = cvCreateMat(3,3,CV_32FC1)
        
        # Set up source points
        storageSrc = cvCreateMemStorage(0)
        src = cvCreateSeq(CV_SEQ_ELTYPE_POINT, sizeof_CvContour, sizeof_CvPoint, storageSrc)
        src = CvSeq_CvPoint2D32f_cast(src)
        srcp = [ (warp_points[0][0], warp_points[0][1]), (warp_points[3][0], warp_points[3][1]), (warp_points[1][0], warp_points[1][1]), (warp_points[2][0], warp_points[2][1]) ]
        [cvSeqPush (src, cvPoint2D32f(*p)) for p in srcp]

        # Now setup DESTINATION points (into dst)
        storageDst = cvCreateMemStorage(0)
        dst = cvCreateSeq(CV_SEQ_ELTYPE_POINT, sizeof_CvContour, sizeof_CvPoint, storageDst)
        dst = CvSeq_CvPoint2D32f_cast(self.dst)
        dstp = [ (0, 0), (0, config.height), (config.width, 0), (config.width, config.height) ]
        [cvSeqPush(dst, cvPoint2D32f(*p)) for p in dstp]

        # Calculate transform MATRIX
        cvGetPerspectiveTransform(src[0], dst[0], mmat)
