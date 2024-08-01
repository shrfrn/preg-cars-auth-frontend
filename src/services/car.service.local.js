import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'

const CAR_KEY = 'carDB'
_createCars()

export const carService = {
	query,
	get,
	remove,
	save,
	getEmptyCar,
	getDefaultFilter,
}

async function query(filterBy = {}) {
	var cars = await storageService.query(CAR_KEY)

	if (filterBy.txt) {
		const regExp = new RegExp(filterBy.txt, 'i')
		cars = cars.filter(car => regExp.test(car.vendor))
	}
    
	if (filterBy.minSpeed) {
		cars = cars.filter(car => car.speed >= filterBy.minSpeed)
	}
	return cars
}

function get(carId) {
	return storageService.get(CAR_KEY, carId)
}

function remove(carId) {
	return storageService.remove(CAR_KEY, carId)
}

function save(car) {
	if (car._id) {
		return storageService.put(CAR_KEY, car)
	} else {
		return storageService.post(CAR_KEY, car)
	}
}

function getEmptyCar(vendor = '', speed = '') {
	return { vendor, speed }
}

function getDefaultFilter() {
	return { txt: '', minSpeed: '' }
}

function _createCars() {
	let cars = utilService.loadFromStorage(CAR_KEY) || []
    if(cars.length) return

    cars.push(_createCar('audu', 300))
    cars.push(_createCar('fiak', 120))
    cars.push(_createCar('subali', 50))
    cars.push(_createCar('mitsu', 150))

    utilService.saveToStorage(CAR_KEY, cars)
}

function _createCar(vendor, speed = 250) {
	const car = getEmptyCar(vendor, speed)
	car._id = utilService.makeId()
	return car
}
