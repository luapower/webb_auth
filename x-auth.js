
// ---------------------------------------------------------------------------
// user settings button & dialog
// ---------------------------------------------------------------------------

function set_night_mode(v) {
	document.body.attr('theme', v ? 'dark' : null)
	document.fire('theme_changed', v ? 'dark' : null)
}

function init_user_settings_nav(module) {

	let set = {}

	set.night_mode = function(v) {
		set_night_mode(v)
	}

	let nav = bare_nav({
		id: module+'_user_settings_nav',
		module: module,
		static_rowset: {
			fields: [
				{
					name: 'night_mode', type: 'bool', default: false,
					text: S('night_mode', 'Night Mode'),
				},
			],
		},
		row_vals: [{
			night_mode: false,
		}],
		props: {row_vals: {slot: 'user'}},
		save_row_on: 'input',
	})

	function set_all() {
		for (let field of nav.all_fields)
			set[field.name](nav.cell_val(nav.focused_row, field))
	}

	nav.on('reset', set_all)

	nav.on('focused_row_cell_val_changed', function(field, v) {
		set[field.name](v)
	})

	nav.on('saved', function() {
		xmodule.save()
	})

	set_all()

	return nav
}

let settings_nav

window.on('load', function() {
	let module = $('x-settings-button')[0].module
	settings_nav = init_user_settings_nav(module)
})

component('x-settings-button', function(e) {

	button.construct(e)

	e.xoff()
	e.bare = true
	e.text = ''
	e.icon = 'fa fa-cog'
	e.xon()

	let tt

	e.on('activate', function() {

		if (tt && tt.target) {

			tt.close()

		} else {

			let night_mode = checkbox({
				nav: settings_nav,
				col: 'night_mode',
				button_style: 'toggle',
				autoclose: true,
			})

			night_mode.on('val_changed', function(v) {
				set_night_mode(v)
			})

			let settings_form = div({}, night_mode)

			tt = tooltip({
				classes: 'x-settings-tooltip',
				target: e, side: 'bottom', align: 'end',
				text: settings_form,
				close_button: true,
				autoclose: true,
			})
			//tt.focusables()[0].focus()
		}

	})

})
