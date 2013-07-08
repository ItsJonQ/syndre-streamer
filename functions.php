<?php
// Mobile Detection
	function deviceClass() {
		require_once('functions/mobile-detect.php');
		$detect = new Mobile_Detect;
		$deviceType = ($detect->isMobile() ? ($detect->isTablet() ? 'tablet' : 'mobile') : 'desktop');
		echo $deviceType;
	}

?>