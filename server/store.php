<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function gps($coordinate, $hemisphere) {
  for ($i = 0; $i < 3; $i++) {
    $part = explode('/', $coordinate[$i]);
    if (count($part) == 1) {
      $coordinate[$i] = $part[0];
    } else if (count($part) == 2) {
      $coordinate[$i] = floatval($part[0])/floatval($part[1]);
    } else {
      $coordinate[$i] = 0;
    }
  }
  list($degrees, $minutes, $seconds) = $coordinate;
  $sign = ($hemisphere == 'W' || $hemisphere == 'S') ? -1 : 1;
  return $sign * ($degrees + $minutes/60 + $seconds/3600);
}
function formatExifDate($exifDate) {
  $fecha = DateTime::createFromFormat("Y:m:d H:i:s", $exifDate);
  return $fecha->format("c");
}

$img = $_FILES['file']['tmp_name'];
//print_r($_FILES['file']);

// OBTENER INFORMACION EXIF
$exif = exif_read_data($img);
//print_r($exif);
$data = [];
if (array_key_exists("DateTimeOriginal", $exif)) {
  $data["date"] = formatExifDate($exif["DateTimeOriginal"]);
}
if (array_key_exists("GPSLongitude", $exif) && array_key_exists("GPSLatitude", $exif)) {
  $longitude = gps($exif["GPSLongitude"], $exif['GPSLongitudeRef']);
  $latitude = gps($exif["GPSLatitude"], $exif['GPSLatitudeRef']);
  $data["gps"] = ["lng" => $longitude, "lat" => $latitude];
}
// GUARDAR IMAGEN
// TODO: OBTENER ID DE DB Y USARLO COMO NOMBRE 
$newname = "newname.jpg"; 
$target = "../img/uploads/" . $newname;
move_uploaded_file($img, $target);

echo json_encode($data);

?>