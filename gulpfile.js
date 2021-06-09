let preprocessor = 'scss', // Preprocessor (sass, less, styl); 'sass' also work with the Scss syntax in blocks/ folder.
		fileswatch   = 'html,htm,txt,json,md,woff,woff2' // List of files extensions for watching & hard reload

const { src, dest, parallel, series, watch } = require('gulp')
const browserSync  = require('browser-sync').create()
const bssi         = require('browsersync-ssi')
const ssi          = require('ssi')
const webpack      = require('webpack-stream')
const scss         = require('gulp-sass')
const scssglob     = require('gulp-sass-glob')
const less         = require('gulp-less')
const lessglob     = require('gulp-less-glob')
const styl         = require('gulp-stylus')
const stylglob     = require("gulp-noop")
const cleancss     = require('gulp-clean-css')
const autoprefixer = require('gulp-autoprefixer')
const rename       = require('gulp-rename')
const imagemin     = require('gulp-imagemin')
const newer        = require('gulp-newer')
const rsync        = require('gulp-rsync')
const del          = require('del')
const gcmq  	   = require('gulp-group-css-media-queries')
const fileinclude  = require('gulp-file-include')

function browsersync() {
	browserSync.init({
		server: {
			baseDir: 'dist/',
			//middleware: includeHTML()
		},
		ghostMode: { clicks: false },
		notify: false,
		online: true,
		//proxy: "localhost"
		//server: false,
		//tunnel: 'yousutename', // Attempt to use the URL https://yousutename.loca.lt
	})
}

function scripts() {
	return src(['app/js/*.js', '!app/js/*.min.js'])
		.pipe(webpack({
			mode: 'production',
			performance: { hints: false },
			module: {
				rules: [
					{
						test: /\.(js)$/,
						exclude: /(node_modules)/,
						loader: 'babel-loader',
						query: {
							presets: ['@babel/env'],
							plugins: ['babel-plugin-root-import']
						}
					}
				]
			}
		})).on('error', function handleError() {
			this.emit('end')
		})
		.pipe(rename('app.min.js'))
		.pipe(dest('dist/js'))
		.pipe(browserSync.stream())
}

function styles() {
	return src([`app/${preprocessor}/*.*`, `!app/${preprocessor}/_*.*`])
		.pipe(eval(`${preprocessor}glob`)())
		.pipe(eval(preprocessor)())
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
		.pipe(gcmq())
		//.pipe(cleancss({ level: { 1: { specialComments: 0 } },/* format: 'beautify' */ }))
		.pipe(rename({ suffix: ".min" }))
		.pipe(dest('dist/css'))
		.pipe(browserSync.stream())
}

function images() {
	return src(['app/images/**/*'])
		// .pipe(newer('dist/images/'))
    .pipe(imagemin())
		.pipe(dest('dist/images'))
		.pipe(browserSync.stream())
}

function buildcopy() {
	return src([
		//'{app/js,app/css}/*.min.*',
		'{app/js,app}/*.min.*',
		'app/images/**/*.*',
		'!app/images/src/**/*',
		'app/fonts/**/*'
	], { base: 'app/' })
	.pipe(dest('dist'))
}

async function buildhtml() {
	let includes = new ssi('app/', 'dist/', '/**/*.html')
	includes.compile()
	del('dist/parts', { force: true })
}

async function includeHTML(){

	del('dist/**/*.html', { force: true })

	let paths = { scripts: { src: 'app/', dest: 'dist/'} }

	return src([
		'app/**/*.html',
		//'!header.html', // ignore
		//'!footer.html' // ignore
	])
	.pipe(fileinclude({
		context: {

		},
		prefix: '@@',
		basepath: '@file'
	}))
	.pipe(dest(paths.scripts.dest))
}


function cleandist() {
	return del('dist/**/*', { force: true })
}

function deploy() {
	return src(['assets/**/*', 'layouts/**/*', '*.php', 'template-parts/*', 'page-templates/**/*', 'blocks/**/*', 'includes/**/*', '*.css', '*.png'])
		.pipe(rsync({
			//hostname: 'a355570_law54@a355570.ftp.mchost.ru',
			//destination: '/home/httpd/vhosts/lawmedgroup.ru/httpdocs/wp-content/themes/Remez/',
			port: 22,
			archive: true,
			silent: false,
			compress: true,
			options: {
				chmod: "ugo=rwX",
				'no-p': true
			}
	}))	
}


function startwatch() {
	watch(`app/${preprocessor}/**/*`, { usePolling: true }, styles)
	watch(['app/js/**/*.js', '!app/js/**/*.min.js'], { usePolling: true }, scripts)
	watch('app/images/**/*.{jpg,jpeg,png,webp,svg,gif}', { usePolling: true }, images)
	watch(`app/**/*.{${fileswatch}}`, { usePolling: true }).on( 'change', includeHTML )
	watch(`app/**/*.{${fileswatch}}`, { usePolling: true }).on( 'change', browserSync.reload )
}

exports.scripts = scripts
exports.styles  = styles
exports.images  = images

exports.includeHTML = includeHTML;


//exports.deploy  = deploy
exports.assets  = series(scripts, styles, images)
exports.build   = series(cleandist, scripts, styles, images, buildcopy, /*buildhtml,*/ includeHTML)
exports.default = series(scripts, styles, images, parallel(browsersync, startwatch))
exports.start   = series(cleandist, buildcopy, scripts, styles, images, includeHTML, parallel(browsersync, startwatch))