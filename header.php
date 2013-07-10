<?php require('templates/header.php'); ?>

<header id="header" class="logo header">
	<div class="header-elements">
		<div class="header-ele icons-options action left sep"><div class="option menu"><i class="icon-menu-2" title="View Stream List"></i></div></div>
		<div class="header-ele the-logo left sep"><a href="http://<?php echo $_SERVER[SERVER_NAME]; ?>"><h1><span class="highlight-text">Syndre</span></h1> Beta</a></div>
		<div class="header-ele watching"><div class="now-watching"></div><div class="stream-title"></div></div>
		<div class="header-ele cutoff"></div>
		<div class="header-ele icons-options right">
			<div class="option chat action right sep"><i class="icon-bubble" title="Toggle Stream Chat"></i></div>
			<div class="option hotkeys action right sep"><i class="text-icon" title="Show Syndre Hotkeys">Hotkeys</i></div>
			<div class="option action game-switch right sep"><a href="/?game=lol"><i class="text-icon" title="Watch League of Legends">LoL</i></a></div>
			<div class="option action game-switch right sep"><a href="http://<?php echo $_SERVER[SERVER_NAME]; ?>/"><i class="text-icon" title="Show Syndre Hotkeys">SC2</i></a></div>
		</div>	
	</div>
</header>