Android Search Webapp
============

# Installation
Just clone the repository into a `project` directory.

	cd /path/to/root
	git clone git@github.com:yectep/androidsearch.git project

# Run
Use Mac OS X's preinstalled **python** `SimpleHTTPServer`

	cd /path/to/root/project
	python -m SimpleHTTPServer

Then go to http://localhost:8000 to run.

# Notes

**Important**: Do not run straight from the `file:///` protocol by opening the `index.html` file as this will cause CORS errors. Use the Python method.

* Requires internet connection to load images from Google Play Store, but nothing else.
* Not tested in IE.
* Default order is *by app title, ascending*.

