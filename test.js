import test, { almost, ok, is } from 'tst'
import window, { apply, cola, hann } from './window.js'
import { hannWindow } from '@audio/stft'

function maxDiff (a, b) {
	let m = 0
	for (let i = 0; i < Math.min(a.length, b.length); i++) m = Math.max(m, Math.abs(a[i] - b[i]))
	return m
}

test('window — periodic hann COLA at N/2 and N/4 hops; symmetric differs', () => {
	let w = window('hann', 1024)
	ok(cola(w, 512).ok, 'hop N/2 COLA')
	ok(cola(w, 256).ok, 'hop N/4 COLA')
	let sym = window('hann', 1024, { periodic: false })
	ok(!cola(sym, 512).ok, 'symmetric hann is not COLA at N/2')
	almost(w[0], 0, 1e-12)
	ok(Math.abs(sym[0] - sym[1023]) < 1e-12, 'symmetric endpoints match')
	// consistency with the ecosystem's internal hannWindow
	let hw = hannWindow(1024)
	ok(maxDiff(w, hw) < 1e-12, 'matches @audio/stft hannWindow')
})

test('window — apply, unknown name throws, re-exports window-function', () => {
	let d = Float64Array.from([1, 1, 1, 1])
	apply(d, Float64Array.from([0.5, 1, 0.5, 1]))
	almost(d[0], 0.5, 1e-12)
	let threw = false
	try { window('nosuch', 64) } catch { threw = true }
	ok(threw)
	is(typeof hann, 'function')
})
