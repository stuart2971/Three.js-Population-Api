let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ antialias: true });
let world;
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );


//Options: ////////////////////////////////////////////////////////////////////////////
let PLANET_RADIUS = 100
let PERSON_SIZE = 6
let MOVEMENT_SPEED = 0.006
let MOVEMENT_RANGE = -0.6 // Keep negative to have random directions
let WORLD_POPULATION = 0

///////////////////////////////////////////////////////////////////////////////////////
// let people = [];
let groups = []
let pivots = [];
let directions = [];
let counter = 0;

function planet(r = 1){
	let shape = new THREE.SphereGeometry( r, 32, 32 );
	let groundMaterial = new THREE.MeshLambertMaterial({ color: 0x634b35});
	world = new THREE.Mesh( shape, groundMaterial );
	return world
}
function light(){
	let light = new THREE.Group()
	
	let light1 = new THREE.DirectionalLight( 0xDDEED3, 1 );
	let light2 = new THREE.AmbientLight(0x7D7D7D);
	light1.position.set( 0, 0, 5 );
	
	light.add(light1);
	light.add(light2);
	return light

}
function person(size = 1, shirtColour = 0xA2FF7A){
    let person = new THREE.Group()
    
    let skinColour = 0x7D5A4F;
    
    let headSize = size * 0.5
    let headShape = new THREE.SphereGeometry(headSize, 32, 32 );
    let headMaterial = new THREE.MeshLambertMaterial({color: skinColour})
    let head = new THREE.Mesh(headShape, headMaterial)

    let bodyWidth = size * 0.5
    let bodyShape = new THREE.BoxGeometry(bodyWidth, size * 0.8, size * 0.4)
    let bodyMaterial = new THREE.MeshLambertMaterial({color: shirtColour})
    let body = new THREE.Mesh(bodyShape, bodyMaterial)
    body.position.set(0, -headSize, 0)

    let armShape = new THREE.SphereGeometry(size * 0.1, 32, 32 );
    let armMaterial = new THREE.MeshLambertMaterial({color: skinColour})
    let leftArm = new THREE.Mesh(armShape, armMaterial)
    let rightArm = new THREE.Mesh(armShape, armMaterial)
    leftArm.position.set(-bodyWidth/1.7, -headSize-0.08*size, 0)
    rightArm.position.set(bodyWidth/1.7, -headSize-0.08*size, 0)

    let leftLeg = new THREE.Mesh(armShape, armMaterial)
    let rightLeg = new THREE.Mesh(armShape, armMaterial)
    leftLeg.position.set(-bodyWidth/3.2, -headSize-0.48*size, 0)
    rightLeg.position.set(bodyWidth/3.2, -headSize-0.48*size, 0)

    person.add(head)
    person.add(body)
    person.add(leftArm)
    person.add(rightArm)
    person.add(leftLeg)
	person.add(rightLeg)
	person.position.set(0, PLANET_RADIUS + PERSON_SIZE, 0)	
	return person
}
function pivot(){
	let shape = new THREE.SphereGeometry( 0.01, 32, 32 );
	let mat = new THREE.MeshLambertMaterial({ color: 0x634b35});
	p = new THREE.Mesh( shape, mat );
	return p
}
function randomAngleTriple() {
	return [
	  2 * Math.PI * Math.random(),
	  2 * Math.PI * Math.random(),
	  2 * Math.PI * Math.random()
	]
}
function addPerson(){
	//Adds person to the people array
	// people.push(person(PERSON_SIZE))

	//Creates a new group containing the pivot and person and with a random location
	let group = new THREE.Group();
	groups.push(group)
	group.add( pivot() );
	group.add( person(PERSON_SIZE) );
	let randomAngle = randomAngleTriple()
	group.rotation.set(randomAngle[0], randomAngle[1], randomAngle[2]);
	pivots.push(group)

	//Gives the object a name so it could be removed later on
	group.name = `${counter}`
	//Adds group to scene
	scene.add(group)

	//Adds a direction to the array so each person can have their own individual direction
	directions.push((Math.random() * MOVEMENT_RANGE * 2) - MOVEMENT_RANGE)

	counter++;
}
function removePerson(index){
	if(groups.length <= 0) return
	let selectedObject = scene.getObjectByName(groups[index].name);
	scene.remove( selectedObject );
	pivots.splice(index, 1)
	directions.splice(index, 1)
	groups.splice(index, 1)
}
function updatePopulation(data){
	let country = data.name
	let population = data.population
	let scaled = Math.floor(data.scaled)
	let popDifference = Math.abs(groups.length - scaled)
	$("#countryName").text(`Country Name: ${country}`)
	$("#population").text(`Population: ${population}`)
	if (scaled > groups.length){
		for(let i = 0; i < popDifference; i++){
			addPerson()
		}
	}else{
		for(let i = 0; i < popDifference; i++){
			removePerson(Math.floor(Math.random() * groups.length))
		}
	}
}

for(let i = 0; i < WORLD_POPULATION; i++){
	addPerson()
}

scene.add(planet(PLANET_RADIUS))
scene.add(light())
var controls = new THREE.OrbitControls( camera, renderer.domElement );
camera.position.z = PLANET_RADIUS + 20;
controls.update()

let animate = () => {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	controls.update()
	for(let i = 0; i < pivots.length; i++){
		randomDir = (Math.random() * 2) - 1
		pivots[i].rotation.x += MOVEMENT_SPEED * directions[i]
		pivots[i].rotation.z += MOVEMENT_SPEED * directions[i]
	}
}
animate()

