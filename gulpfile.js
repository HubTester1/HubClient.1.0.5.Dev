
// ----- PULL IN MODULES

const gulp = require('gulp');
const spSave = require('gulp-spsave');
const cached = require('gulp-cached');
const plumber = require('gulp-plumber');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const { argv } = require('yargs');
const webpackV1ProdConfig = require('./webpack/v1.prod.css.config');
const webpackV2ProdConfig = require('./webpack/v2.prod.css.config');
const webpackV4DevConfig = require('./webpack/v4.dev.css.config');
const webpackV4ProdConfig = require('./webpack/v4.prod.css.config');
const webpackV5DevConfig = require('./webpack/v5.dev.config');
const webpackV5StageConfig = require('./webpack/v5.stage.config');
const webpackV5DevLoaderConfig = require('./webpack/v5.dev.loader.config');
const webpackV5StageLoaderConfig = require('./webpack/v5.stage.loader.config');
const webpackV5ProdConfig = require('./webpack/v5.prod.config');
const gulpBaseConfig = require('./gulp/base.config');
const gulpV1ProdConfig = require('./gulp/v1.prod.config');
const gulpV2ProdConfig = require('./gulp/v2.prod.config');
const gulpV4DevConfig = require('./gulp/v4.dev.config');
const gulpV4ProdConfig = require('./gulp/v4.prod.config');
const gulpV5DevConfig = require('./gulp/v5.dev.config');
const gulpV5StageConfig = require('./gulp/v5.stage.config');
const gulpV5ProdConfig = require('./gulp/v5.prod.config');

// ----- CONFIG TASKS

// STAGE

// build dist file
gulp.task('5-stage-build', () =>
	// for all files in the src folder
	gulp.src(`${gulpV5StageConfig.ReturnV5StageSrcFolder()}/**`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them through webpack
		.pipe(webpackStream(webpackV5StageConfig), webpack)
		// to the dist folder
		.pipe(gulp.dest(`${gulpV5StageConfig.ReturnV5StageDistFolder()}`)));
// push dist to stage
gulp.task('5-stage-push', () =>
	// for all files in the dist folder
	gulp.src(`${gulpV5StageConfig.ReturnV5StageDistFolder()}/**`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them into a caching proxy 
		.pipe(cached('spFiles'))
		// and then to SP stage location
		.pipe(spSave(
			gulpV5StageConfig.ReturnV5SPSaveStageOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));
// push js to stage
gulp.task('5-stage-push-js', () =>
	// for all files in the dist folder
	gulp.src(`${gulpV5StageConfig.ReturnV5StageDistFolder()}/+(*.js|*.js.map)`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them into a caching proxy 
		.pipe(cached('spFiles'))
		// and then to SP stage location
		.pipe(spSave(
			gulpV5StageConfig.ReturnV5SPSaveStageOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));
// push styles to stage
gulp.task('5-stage-push-styles', () =>
	// for all files in the dist folder
	gulp.src(`${gulpV5StageConfig.ReturnV5StageDistFolder()}/+(*.css|*.css.map)`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them into a caching proxy 
		.pipe(cached('spFiles'))
		// and then to SP stage location
		.pipe(spSave(
			gulpV5StageConfig.ReturnV5SPSaveStageOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));

// build dist file and push dist to stage
gulp.task('5-stage-build-push', () =>
	// for all files in the src folder
	gulp.src(`${gulpV5StageConfig.ReturnV5StageSrcFolder()}/**`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them through webpack
		.pipe(webpackStream(webpackV5StageConfig), webpack)
		// to the dist folder
		.pipe(gulp.dest(`${gulpV5StageConfig.ReturnV5StageDistFolder()}`))
		// and then to SP stage location
		.pipe(spSave(
			gulpV5StageConfig.ReturnV5SPSaveStageOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));
// build dist file and push dist to stage
gulp.task('5-stage-build-push-loader', () =>
	// for all files in the src folder
	gulp.src(`${gulpV5StageConfig.ReturnV5StageSrcFolder()}/**`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them through webpack
		.pipe(webpackStream(webpackV5StageLoaderConfig), webpack)
		// to the dist folder
		.pipe(gulp.dest(`${gulpV5StageConfig.ReturnV5StageDistFolder()}`))
		// and then to SP stage location
		.pipe(spSave(
			gulpV5StageConfig.ReturnV5SPSaveStageOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));
// when src changes, build dist file and push dist to stage
gulp.task('5-stage-watch-all-build-push-js', () => {
	// watch the src folder; upon changes, build dist file and push dist to stage
	gulp.watch([`${gulpV5StageConfig.ReturnV5StageSrcFolder()}/**`], gulp.series('5-stage-build', '5-stage-push-js'));
});
// when src changes, build dist file and push dist to stage
gulp.task('5-stage-watch-all-build-push-styles', () => {
	// watch the src folder; upon changes, build dist file and push dist to stage
	gulp.watch([`${gulpV5StageConfig.ReturnV5StageSrcFolder()}/**`], gulp.series('5-stage-build', '5-stage-push-styles'));
});
// when src changes, build dist file and push dist to stage
gulp.task('5-stage-watch-all-build-push-loader', () => {
	// watch the src folder; upon changes, build dist file and push dist to stage
	gulp.watch([`${gulpV5StageConfig.ReturnV5StageSrcFolder()}/**`], gulp.series('5-stage-build-push-loader'));
});
// when src changes, build dist file and push dist to stage
gulp.task('5-stage-watch-build-push', () => {
	// watch the src folder; upon changes, build dist file and push dist to stage
	gulp.watch([`${gulpV5StageConfig.ReturnV5StageSrcFolder()}/**`], gulp.series('5-stage-build-push'));
});

// PROD

// build style file
gulp.task('4-prod-build-styles', () =>
	// for specified src style file
	gulp.src(gulpV4ProdConfig.ReturnV4ProdStylesSrcFile())
		// replace the standard pipe method
		.pipe(plumber())
		// pipe it through webpack
		.pipe(webpackStream(webpackV4ProdConfig), webpack)
		// to the specified style folder
		.pipe(gulp.dest(gulpV4ProdConfig.ReturnV4ProdStylesDistFolder())));
// push style file to dev
gulp.task('4-prod-push-styles', () =>
	// for specified dist style file
	gulp.src(gulpV4ProdConfig.ReturnV4ProdStylesDistFile())
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them into a caching proxy 
		.pipe(cached('spFiles'))
		// and then to SP dev location
		.pipe(spSave(
			gulpV4ProdConfig.ReturnV4ProdSPSaveCSSOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));
// build style file and push style file to dev
gulp.task('4-prod-build-push-styles', () =>
	// for specified style file
	gulp.src(gulpV4ProdConfig.ReturnV4ProdStylesSrcFile())
		// replace the standard pipe method
		.pipe(plumber())
		// pipe it through webpack
		.pipe(webpackStream(webpackV4ProdConfig), webpack)
		// to the specified style folder
		.pipe(gulp.dest(gulpV4ProdConfig.ReturnV4ProdStylesDistFolder()))
		// and then to SP dev location
		.pipe(spSave(
			gulpV4ProdConfig.ReturnV4ProdSPSaveCSSOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));
// when the specified src style file changes, build dist style file and push it to dev
gulp.task('4-prod-watch-build-push-styles', () => {
	// watch the src style file; upon changes, build dist style file and push it to dev
	gulp.watch([gulpV4ProdConfig.ReturnV4ProdStylesSrcFile()], gulp.series('4-prod-push-styles'));
});
// push specified swf api file to dev
gulp.task('4-prod-push-api', () =>
	// for specified dist swf api file
	gulp.src(gulpV4ProdConfig.ReturnV4ProdSWFAPIFile())
		// and then to SP dev location
		.pipe(spSave(
			gulpV4ProdConfig.ReturnV4ProdSPSaveSWFAPIOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));
// wait for save and then push specified swf api file to dev
gulp.task('4-prod-wait-push-api', () => {
	setTimeout(
		() =>
			// for specified dist swf api file
			gulp.src(gulpV4ProdConfig.ReturnV4ProdSWFAPIFile())
				// and then to SP dev location
				.pipe(spSave(
					gulpV4ProdConfig.ReturnV4ProdSPSaveSWFAPIOptions(),
					gulpBaseConfig.ReturnGulpSPSaveCredentials(),
				))
		, 500,
	);
});
// when the specified swf api file changes, push it to dev
gulp.task('4-prod-watch-push-api', () => {
	// watch the src style file; upon changes, build dist style file and push it to dev
	gulp.watch([gulpV4ProdConfig.ReturnV4ProdSWFAPIFile()], gulp.series('4-prod-wait-push-api'));
});


// V5 ---

// DEV

// build dist file
gulp.task('5-dev-build', () =>
	// for all files in the src folder
	gulp.src(`${gulpV5DevConfig.ReturnV5DevSrcFolder()}/**`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them through webpack
		.pipe(webpackStream(webpackV5DevConfig), webpack)
		// to the dist folder
		.pipe(gulp.dest(`${gulpV5DevConfig.ReturnV5DevDistFolder()}`)));
// push dist to dev
gulp.task('5-dev-push', () =>
	// for all files in the dist folder
	gulp.src(`${gulpV5DevConfig.ReturnV5DevDistFolder()}/**`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them into a caching proxy 
		.pipe(cached('spFiles'))
		// and then to SP dev location
		.pipe(spSave(
			gulpV5DevConfig.ReturnV5SPSaveDevOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));
// push js to dev
gulp.task('5-dev-push-js', () =>
	// for all files in the dist folder
	gulp.src(`${gulpV5DevConfig.ReturnV5DevDistFolder()}/+(*.js|*.js.map)`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them into a caching proxy 
		.pipe(cached('spFiles'))
		// and then to SP dev location
		.pipe(spSave(
			gulpV5DevConfig.ReturnV5SPSaveDevOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));
// push styles to dev
gulp.task('5-dev-push-styles', () =>
	// for all files in the dist folder
	gulp.src(`${gulpV5DevConfig.ReturnV5DevDistFolder()}/+(*.css|*.css.map)`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them into a caching proxy 
		.pipe(cached('spFiles'))
		// and then to SP dev location
		.pipe(spSave(
			gulpV5DevConfig.ReturnV5SPSaveDevOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));

// build dist file and push dist to dev
gulp.task('5-dev-build-push', () =>
	// for all files in the src folder
	gulp.src(`${gulpV5DevConfig.ReturnV5DevSrcFolder()}/**`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them through webpack
		.pipe(webpackStream(webpackV5DevConfig), webpack)
		// to the dist folder
		.pipe(gulp.dest(`${gulpV5DevConfig.ReturnV5DevDistFolder()}`))
		// and then to SP dev location
		.pipe(spSave(
			gulpV5DevConfig.ReturnV5SPSaveDevOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));
// build dist file and push dist to dev
gulp.task('5-dev-build-push-loader', () =>
	// for all files in the src folder
	gulp.src(`${gulpV5DevConfig.ReturnV5DevSrcFolder()}/**`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them through webpack
		.pipe(webpackStream(webpackV5DevLoaderConfig), webpack)
		// to the dist folder
		.pipe(gulp.dest(`${gulpV5DevConfig.ReturnV5DevDistFolder()}`))
		// and then to SP dev location
		.pipe(spSave(
			gulpV5DevConfig.ReturnV5SPSaveDevOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));
// when src changes, build dist file and push dist to dev
gulp.task('5-dev-watch-all-build-push-js', () => {
	// watch the src folder; upon changes, build dist file and push dist to dev
	gulp.watch([`${gulpV5DevConfig.ReturnV5DevSrcFolder()}/**`], gulp.series('5-dev-build', '5-dev-push-js'));
});
// when src changes, build dist file and push dist to dev
gulp.task('5-dev-watch-all-build-push-styles', () => {
	// watch the src folder; upon changes, build dist file and push dist to dev
	gulp.watch([`${gulpV5DevConfig.ReturnV5DevSrcFolder()}/**`], gulp.series('5-dev-build', '5-dev-push-styles'));
});
// when src changes, build dist file and push dist to dev
gulp.task('5-dev-watch-all-build-push-loader', () => {
	// watch the src folder; upon changes, build dist file and push dist to dev
	gulp.watch([`${gulpV5DevConfig.ReturnV5DevSrcFolder()}/**`], gulp.series('5-dev-build-push-loader'));
});
// when src changes, build dist file and push dist to dev
gulp.task('5-dev-watch-build-push', () => {
	// watch the src folder; upon changes, build dist file and push dist to dev
	gulp.watch([`${gulpV5DevConfig.ReturnV5DevSrcFolder()}/**`], gulp.series('5-dev-build-push'));
});

// PROD

// push all to prod
gulp.task('5-prod-push-all', () =>
	// for all files in the dist folder
	gulp.src(`${gulpV5ProdConfig.ReturnV5ProdDistFolder()}/**`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them into a caching proxy 
		.pipe(cached('spFiles'))
		// and then to SP prod location
		.pipe(spSave(
			gulpV5ProdConfig.ReturnV5SPSaveProdOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));

// push js to prod
gulp.task('5-prod-push-js', () =>
	// for all files in the dist folder
	gulp.src(`${gulpV5ProdConfig.ReturnV5ProdDistFolder()}/+(*.js|*.js.map)`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them into a caching proxy 
		.pipe(cached('spFiles'))
		// and then to SP prod location
		.pipe(spSave(
			gulpV5ProdConfig.ReturnV5SPSaveProdOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));

// push styles to prod
gulp.task('5-prod-push-styles', () =>
	// for all files in the dist folder
	gulp.src(`${gulpV5ProdConfig.ReturnV5ProdDistFolder()}/+(*.css|*.css.map)`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them into a caching proxy 
		.pipe(cached('spFiles'))
		// and then to SP prod location
		.pipe(spSave(
			gulpV5ProdConfig.ReturnV5SPSaveProdOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));

// push app js to prod
gulp.task('5-prod-push-app-js', () =>
	// for all files in the dist folder
	gulp.src(`${gulpV5ProdConfig.ReturnV5ProdDistFolder()}/+(*App.js|*App.js.map)`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them into a caching proxy 
		.pipe(cached('spFiles'))
		// and then to SP prod location
		.pipe(spSave(
			gulpV5ProdConfig.ReturnV5SPSaveProdOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));


// push app to prod
gulp.task('5-prod-push-app-all', () =>
	// for all files in the dist folder
	gulp.src(`${gulpV5ProdConfig.ReturnV5ProdDistFolder()}/+(*App.js|*App.js.map|*.css|*.css.map)`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them into a caching proxy 
		.pipe(cached('spFiles'))
		// and then to SP prod location
		.pipe(spSave(
			gulpV5ProdConfig.ReturnV5SPSaveProdOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));
// build dist file and push dist to dev
gulp.task('5-prod-build-push', () =>
	// for all files in the src folder
	gulp.src(`${gulpV5ProdConfig.ReturnV5ProdSrcFolder()}/**`)
		// replace the standard pipe method
		.pipe(plumber())
		// pipe them through webpack
		.pipe(webpackStream(webpackV5ProdConfig), webpack)
		// to the dist folder
		.pipe(gulp.dest(`${gulpV5ProdConfig.ReturnV5ProdDistFolder()}`))
		// and then to SP dev location
		.pipe(spSave(
			gulpV5ProdConfig.ReturnV5SPSaveProdOptions(),
			gulpBaseConfig.ReturnGulpSPSaveCredentials(),
		)));

// when src changes, build dist files and push dist to prod
gulp.task('5-prod-watch-build-push', () => {
	// watch the src folder; upon changes, build dist file and push dist to dev
	gulp.watch([`${gulpV5ProdConfig.ReturnV5ProdSrcFolder()}/**`], gulp.series('5-prod-build-push'));
});

