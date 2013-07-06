<?php require('header.php'); ?>
	<div id="header" class="logo header">
		<div class="header-elements">
			<div class="the-menu action"><i class="icon-menu-2"></i></div>
			<div class="the-logo action"><span class="highlight-text">Syndre</span> Beta</div>
			<div class="watching">Now Watching</div>
			<div class="icons-options right">
				<div class="option chat action"><i class="icon-bubble"></i></div>
			</div>	
		</div>
	</div>
	<div id="stream-wrapper" class="stream-wrapper">
		<div id="streamer-list">
			<div class="list-refresh icons-options action list-header">
				<div class="option refresh action"><i class="icon-loop-2"></i> Refresh</div>
			</div>
			<ul></ul>
		</div>
		<div id="livestream" class="livestream-viewer"></div>
		<?php include('sidebar.php'); ?>
	</div>
	<div id="streamer-watching"></div>
<?php require('footer.php'); ?>
