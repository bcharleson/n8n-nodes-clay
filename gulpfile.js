const path = require('path');
const { task, src, dest } = require('gulp');

task('build:icons', copyIcons);

function copyIcons() {
	const nodeSource = path.resolve('nodes', '**', '*.{png,svg}');
	const nodeDestination = path.resolve('dist', 'nodes');

	src(nodeSource).pipe(dest(nodeDestination));

	const credSource = path.resolve('credentials', '**', '*.{png,svg}');
	const credDestination = path.resolve('dist', 'credentials');

	src(credSource).pipe(dest(credDestination));

	const iconSource = path.resolve('icons', '*.{png,svg}');
	const iconDestination = path.resolve('dist', 'icons');

	return src(iconSource).pipe(dest(iconDestination));
}
