<?php
/*
  $_FILES = array (
    'file' => array (
      'name' => 'fezbot2000-1511423-unsplash.jpg',
      'type' => 'image/jpeg',
      'tmp_name' => '/Applications/MAMP/tmp/php/phpYHD7VT',
      'error' => 0,
      'size' => 358840,
    ),
  )

*/
header('Content-Type: application/json');

if($_FILES['file']['error']) {
  // managing server side errors, see https://www.php.net/manual/en/features.file-upload.php
  echo json_encode(array(
    'tmp_file'  => null,
    'error'     => 'Ops, you\'ve got an error!'
  ));

} else {
  echo json_encode(array(
    'tmp_file' => $_FILES['file']['tmp_name'],
    'error'    => null
  ));

  // after form submit move the file form temporary dir to definitive location
  // see https://www.php.net/manual/en/function.move-uploaded-file.php
}
