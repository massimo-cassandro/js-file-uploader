<?php

// this is an example of a function to load file properties
// from filesystem (may be db driven too)

function get_file_properties($file) {
  $file_path = "../test-files/{$file}";
  $img_size= getimagesize($file_path );
  return array(
    "id"   => "123", // this is a fake value, but it can be a db record id or something else
    "name" => $file,
    "src"  => $file_path,
    "wi"   => $img_size[0],
    "he"   => $img_size[1],
    "size" => filesize($file_path)
  );
}

