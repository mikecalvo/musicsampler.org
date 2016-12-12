<script type="text/javascript">

function populateTracks() {
	tracks = new Array(


<?

# This function reads your DATABASE_URL configuration automatically set by Heroku
# the return value is a string that will work with pg_connect
function pg_connection_string() {
	return "dbname=abcdefg host=****.amazonaws.com port=5432 user=**** password=**** sslmode=require";
}

$server='10.6.166.232:3306';
$username="musicsampler";
$password="J0yD1v1s10n";
$database="musicsampler";

$link = mysql_connect($server,$username,$password);
@mysql_select_db($database) or die( "Unable to select database");
if (!$link) {
    die('Could not connect: ' . mysql_error());
}
$query="SELECT * FROM song where release_year=$year order by track asc";
$result=mysql_query($query);

$num=mysql_numrows($result);

mysql_close();

$i=0;
while ($i < $num) {

$title=mysql_result($result,$i,"title");
$artist=mysql_result($result,$i,"artist");
$album=mysql_result($result,$i,"album");
$comments=htmlspecialchars(mysql_result($result, $i, "comments"));

if ($i > 0 ) {
   echo ",";
}
echo "track('$title', '$artist', '$comments')\n";
$i++;
}

mysql_close($link);
?>
);

	for (var i=0; i < tracks.length; i++) {
		// Preload the image
		var preload = new Image(200,200);
		preload.src='covers/'+(i+1)+'.jpg';
		preload.align='left';
		images[i] = preload;

		var row = new Element('div', {'id': i, 'class': 'track' });
		row.update("Track "+(i+1)+" - \""+tracks[i].title+"\" by "+tracks[i].artist);
		row.observe('mouseover', handleMouseOver);
		row.observe('click', handleClick);
		row.observe('mouseout', handleMouseOut);
		$('tracks').insert(row);
	}
}
</script>
