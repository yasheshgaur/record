<?php
	ini_set('display_errors', 'On');
	error_reporting(E_ALL | E_STRICT);
?>

$data = $_REQUEST['audio'];
$ourFileName = "uploads/voiceFile.wav";
$fh = fopen($ourFileName, 'w') or die("can't open file");
fwrite($fh, $data);
fclose($fh);