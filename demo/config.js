/**
 * This file is part of the "malle" library
 * Copyright 2021 Nicolas CARPi @ Deltablot
 * License MIT
 * https://github.com/deltablot/malle
 */

// this file allows us to figure out if we are in dev or demo/prod mode
// the Dockerfile will change 'dev' to 'prod' at build time
// there are no concepts of "env" in browser, so this is how we do it
export default { env: 'dev' }
