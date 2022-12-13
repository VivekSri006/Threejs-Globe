// Fetch all country data
fetch('./data/Solar_Energy_geo.geojson').then(res => res.json()).then(countries => {
    // console.log(country.properties.Color);
    // Create the 3D globe
    const world = Globe({
            animateIn: false
        })
        .globeImageUrl('./assets/img/earth-blue-marble.jpg')
        .bumpImageUrl('./assets/img/earth-topology.png')
        // .backgroundImageUrl('./assets/img/night-sky.png')
        .backgroundColor('#ffffff') // To Background Color Change
        .lineHoverPrecision(0)
        .polygonsData(countries.features.filter(country => country.properties.ISO_A2 !== 'AQ'))
        .polygonAltitude(0.003)
        .polygonCapColor(country => country.properties.color)
        // .polygonCapColor(countries.features.filter(country => country.properties.Color))
        // .polygonCapColor(country => country === hover ? 'yellow' : 'transparent')

        .polygonSideColor(country => 'transparent')
        .polygonStrokeColor(country => 'black')
        .polygonLabel(({
            properties: country
        }) => 
        // `
        //   <b>${country.ADMIN} (${country.ISO_A2}):</b> <br />
        //   GDP: <i>${country.GDP_MD_EST}</i> M$<br/>
        //   Population: <i>${country.POP_EST}</i>
        // `
        `
        COUNTRY:<b>${country.COUNTRY}</b> <br />
        CAPACITY: <i>${country.capacity_1}</i>
        `
        )
        .onPolygonHover(hover => world
            .polygonAltitude(country => country === hover ? 0.04 : 0.003)
            .polygonSideColor(country => country === hover ? '#00000080' : 'transparent')
            // .polygonCapColor(country => country === hover ? 'yellow' : 'transparent')
            // .polygonCapColor(country => country === hover ? country.properties.Color : 'transparent')
        )
        .polygonsTransitionDuration(300)
        (document.getElementById('globe'));

    // Custom globe material
    const globeMaterial = world.globeMaterial();
    globeMaterial.bumpScale = 20;

    new THREE.TextureLoader().load('', texture => {
        globeMaterial.specularMap = texture;
        globeMaterial.specular = new THREE.Color('grey');
        globeMaterial.shininess = 15;
    });

    // Make globe spin

    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.35;

    // Render cloud sphere over globe

    const cloudImage = './assets/img/clouds.png';
    const cloudAltitude = 0.004;
    const cloudRotationSpeed = -0.006; // Degrees per frame

    new THREE.TextureLoader().load(cloudImage, texture => {
        const clouds = new THREE.Mesh(
            new THREE.SphereBufferGeometry(world.getGlobeRadius() * (1 + cloudAltitude), 75, 75),
            new THREE.MeshPhongMaterial({
                map: texture,
                transparent: true
            })
        );
        world.scene().add(clouds);

        (function rotateClouds() {
            clouds.rotation.y += cloudRotationSpeed * Math.PI / 180;
            requestAnimationFrame(rotateClouds);
        })();
    });
})