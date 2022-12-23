const uid = req.query.uid;
const user = await users.get({ uid: uid });
const application = req.headers.application;
const destapplication = req.headers.destapplication;
const tenant = req.headers.tenant;

const allRoles = roles.list({ application: destapplication });//[{"id":"ADMIN","description":"ADMIN"}, {"id":"ADMIN2","description":"ADMIN2"}];
let rolesAvailable = [];
let reolesMap = {};
for (const [key, value] of Object.entries(allRoles)) {
    rolesAvailable.push({ id: key, description: value.description || key });

    reolesMap[key] = value;
}


let userRoles = [];
if (user.customClaimsJSON) {
    const tenantRole = (user.customClaimsJSON || {})[tenant];
    if (tenantRole) {
        const destappRole = tenantRole[destapplication];
        if (destappRole) {
            userRoles = destappRole.map(x => { return { id: x, description: reolesMap[x].description || x } });
        }
    }
}



const ret = {
    uid: user.uid,
    displayName: user.displayName,
	photoURL: user.photoURL,
    userPhoto:user.photoURL,
    email: user.email,
    emailVerified: user.emailVerified,
    disabled: user.user ? user.user.disabled : false,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime,
    userRoles: userRoles,
    rolesAvailable: rolesAvailable
};

return ret;