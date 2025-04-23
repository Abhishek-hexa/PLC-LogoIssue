import * as THREE from 'three';

export class Utils3d {
    static findClosestPoint(points, target) {
        if (points.length === 0) {
            return null;
        }

        let closestPoint = points[0];
        let minDistanceSq = target.distanceToSquared(points[0]);

        for (let i = 1; i < points.length; i++) {
            const distanceSq = target.distanceToSquared(points[i]);
            if (distanceSq < minDistanceSq) {
                minDistanceSq = distanceSq;
                closestPoint = points[i];
            }
        }
        return closestPoint;
    }

    static calculateClosestPointNormal(mesh, point) {
        // Get the geometry's position and index attributes
        const positions = mesh.geometry.attributes.position.array;
        const indices = mesh.geometry.index ? mesh.geometry.index.array : null;

        // If there's no index buffer, we need to handle triangles directly
        if (!indices) {
            return this.calculateClosestFaceNormalNoIndices(
                mesh,
                point,
                positions,
            );
        }

        // Calculate center point and normal for each face
        const faces = [];
        for (let i = 0; i < indices.length; i += 3) {
            const idx1 = indices[i];
            const idx2 = indices[i + 1];
            const idx3 = indices[i + 2];

            // Get vertices of this face
            const v1 = new THREE.Vector3(
                positions[idx1 * 3],
                positions[idx1 * 3 + 1],
                positions[idx1 * 3 + 2],
            );

            const v2 = new THREE.Vector3(
                positions[idx2 * 3],
                positions[idx2 * 3 + 1],
                positions[idx2 * 3 + 2],
            );

            const v3 = new THREE.Vector3(
                positions[idx3 * 3],
                positions[idx3 * 3 + 1],
                positions[idx3 * 3 + 2],
            );

            // Calculate face center
            const center = new THREE.Vector3()
                .add(v1)
                .add(v2)
                .add(v3)
                .divideScalar(3);

            // Calculate face normal
            const edge1 = new THREE.Vector3().subVectors(v2, v1);
            const edge2 = new THREE.Vector3().subVectors(v3, v1);
            const normal = new THREE.Vector3()
                .crossVectors(edge1, edge2)
                .normalize();

            faces.push({
                center,
                normal,
                vertices: [v1, v2, v3],
            });
        }

        // Find the face with center closest to our point
        let closestFace = faces[0];
        let minDistanceSq = point.distanceToSquared(faces[0].center);

        for (let i = 1; i < faces.length; i++) {
            const distanceSq = point.distanceToSquared(faces[i].center);
            if (distanceSq < minDistanceSq) {
                minDistanceSq = distanceSq;
                closestFace = faces[i];
            }
        }

        return closestFace.normal;
    }

    static calculateClosestFaceNormalNoIndices(mesh, point, positions) {
        const faces = [];

        for (let i = 0; i < positions.length; i += 9) {
            // Get vertices of this face
            const v1 = new THREE.Vector3(
                positions[i],
                positions[i + 1],
                positions[i + 2],
            );

            const v2 = new THREE.Vector3(
                positions[i + 3],
                positions[i + 4],
                positions[i + 5],
            );

            const v3 = new THREE.Vector3(
                positions[i + 6],
                positions[i + 7],
                positions[i + 8],
            );

            // Calculate face center
            const center = new THREE.Vector3()
                .add(v1)
                .add(v2)
                .add(v3)
                .divideScalar(3);

            // Calculate face normal
            const edge1 = new THREE.Vector3().subVectors(v2, v1);
            const edge2 = new THREE.Vector3().subVectors(v3, v1);
            const normal = new THREE.Vector3()
                .crossVectors(edge1, edge2)
                .normalize();

            faces.push({
                center,
                normal,
                vertices: [v1, v2, v3],
            });
        }

        let closestFace = faces[0];
        let minDistanceSq = point.distanceToSquared(faces[0].center);

        for (let i = 1; i < faces.length; i++) {
            const distanceSq = point.distanceToSquared(faces[i].center);
            if (distanceSq < minDistanceSq) {
                minDistanceSq = distanceSq;
                closestFace = faces[i];
            }
        }

        return closestFace.normal;
    }

    static getCenterPointAndNormal = (mesh) => {
        const geometry = mesh.geometry;
        const positions = geometry.attributes.position;
        const normals = geometry.attributes.normal;
        const uvs = geometry.attributes.uv;
        const matrixWorld = mesh.matrixWorld;

        const center = new THREE.Vector3(0, 0, 0);
        const count = positions.count;

        // Calculate the center in 3D space
        for (let i = 0; i < count; i++) {
            const vertex = new THREE.Vector3()
                .fromBufferAttribute(positions, i)
                .applyMatrix4(matrixWorld);
            center.add(vertex);
        }
        center.divideScalar(count);

        // Find the closest vertex to the center
        let closestDistance = Infinity;
        let closestIndex = 0;

        for (let i = 0; i < count; i++) {
            const vertex = new THREE.Vector3()
                .fromBufferAttribute(positions, i)
                .applyMatrix4(matrixWorld);
            const distance = vertex.distanceTo(center);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = i;
            }
        }

        const normal = new THREE.Vector3()
            .fromBufferAttribute(normals, closestIndex)
            .applyMatrix4(matrixWorld);

        const position = new THREE.Vector3()
            .fromBufferAttribute(positions, closestIndex)
            .applyMatrix4(matrixWorld);

        const uv = new THREE.Vector2().fromBufferAttribute(uvs, closestIndex);

        return {
            center: position,
            normal,
            uv,
        };
    };

    static calculateClosestFaceNormal(mesh, point) {
        const geometry = mesh.geometry;

        // First find the closest vertex (as in your original code)
        const allMeshPositions = geometry.attributes.position.array;
        const allPanelPositionsVectors = [];

        for (let i = 0; i < allMeshPositions.length; i += 3) {
            allPanelPositionsVectors.push(
                new THREE.Vector3(
                    allMeshPositions[i],
                    allMeshPositions[i + 1],
                    allMeshPositions[i + 2],
                ),
            );
        }

        const closestPoint = this.findClosestPoint(
            allPanelPositionsVectors,
            point,
        );
        if (!closestPoint) {
            console.error('closest point not found');
            return null;
        }

        const closestPointIndex = allPanelPositionsVectors.findIndex((p) =>
            p.equals(closestPoint),
        );

        // Now find all faces that include this vertex
        const index = geometry.index ? geometry.index.array : null;
        const position = geometry.attributes.position.array;
        const faces = [];

        if (index) {
            // Indexed geometry
            for (let i = 0; i < index.length; i += 3) {
                const a = index[i];
                const b = index[i + 1];
                const c = index[i + 2];

                if (
                    a === closestPointIndex ||
                    b === closestPointIndex ||
                    c === closestPointIndex
                ) {
                    const face = {
                        a: a,
                        b: b,
                        c: c,
                        normal: new THREE.Vector3(),
                    };

                    // Calculate face normal
                    const vA = new THREE.Vector3().fromArray(position, a * 3);
                    const vB = new THREE.Vector3().fromArray(position, b * 3);
                    const vC = new THREE.Vector3().fromArray(position, c * 3);

                    const cb = new THREE.Vector3().subVectors(vC, vB);
                    const ab = new THREE.Vector3().subVectors(vA, vB);
                    cb.cross(ab).normalize();

                    face.normal.copy(cb);
                    faces.push(face);
                }
            }
        } else {
            // Non-indexed geometry
            for (let i = 0; i < position.length / 9; i++) {
                const a = i * 3;
                const b = a + 1;
                const c = a + 2;

                if (
                    a === closestPointIndex ||
                    b === closestPointIndex ||
                    c === closestPointIndex
                ) {
                    const face = {
                        a: a,
                        b: b,
                        c: c,
                        normal: new THREE.Vector3(),
                    };

                    const vA = new THREE.Vector3().fromArray(position, a * 3);
                    const vB = new THREE.Vector3().fromArray(position, b * 3);
                    const vC = new THREE.Vector3().fromArray(position, c * 3);

                    const cb = new THREE.Vector3().subVectors(vC, vB);
                    const ab = new THREE.Vector3().subVectors(vA, vB);
                    cb.cross(ab).normalize();

                    face.normal.copy(cb);
                    faces.push(face);
                }
            }
        }

        if (faces.length === 0) {
            console.error('No faces found for the closest vertex');
            return null;
        }

        // Find the face whose center is closest to the point
        let closestFace = null;
        let minDistance = Infinity;

        faces.forEach((face) => {
            const vA = new THREE.Vector3().fromArray(position, face.a * 3);
            const vB = new THREE.Vector3().fromArray(position, face.b * 3);
            const vC = new THREE.Vector3().fromArray(position, face.c * 3);

            const center = new THREE.Vector3()
                .add(vA)
                .add(vB)
                .add(vC)
                .multiplyScalar(1 / 3);

            const distance = center.distanceTo(point);

            if (distance < minDistance) {
                minDistance = distance;
                closestFace = face;
            }
        });

        return closestFace.normal;
    }
    static calculateRotation = (planeNormal, mouseDirection) => {
        const dominantAxis = {
            isXAxis: Math.abs(planeNormal.x) > 0.9,
            isYAxis: Math.abs(planeNormal.y) > 0.8,
            isZAxis: Math.abs(planeNormal.z) > 0.9,
        };

        let rotationAngle, directionSign, finalRotation;

        if (dominantAxis.isXAxis) {
            rotationAngle = Math.atan2(mouseDirection.y, mouseDirection.z);
            directionSign = Math.sign(planeNormal.x);
            rotationAngle *= -directionSign;
            finalRotation = rotationAngle;
            finalRotation =
                planeNormal.x < 0 ? finalRotation : finalRotation + Math.PI;
        } else if (dominantAxis.isZAxis) {
            rotationAngle = Math.atan2(mouseDirection.y, mouseDirection.x);
            directionSign = Math.sign(planeNormal.z);
            rotationAngle *= directionSign;
            finalRotation = rotationAngle;
            finalRotation =
                planeNormal.z < 0 ? finalRotation + Math.PI : finalRotation;
        } else if (dominantAxis.isYAxis) {
            rotationAngle = Math.atan2(mouseDirection.x, mouseDirection.z);
            directionSign = Math.sign(planeNormal.y);
            rotationAngle *= directionSign;
            if (planeNormal.z > 0) {
                finalRotation = rotationAngle - Math.PI / 2;
            } else {
                finalRotation = rotationAngle + Math.PI / 2;
            }
        }

        return finalRotation;
    };
    static calculateRotation1 = (planeNormal, mouseDirection) => {
        // First normalize the planeNormal vector
        const magnitude = Math.sqrt(
            planeNormal.x * planeNormal.x +
                planeNormal.y * planeNormal.y +
                planeNormal.z * planeNormal.z,
        );

        const normalizedNormal = {
            x: planeNormal.x / magnitude,
            y: planeNormal.y / magnitude,
            z: planeNormal.z / magnitude,
        };

        // Now determine the dominant axis using the normalized vector
        const dominantAxis = {
            isXAxis:
                Math.abs(normalizedNormal.x) > Math.abs(normalizedNormal.y) &&
                Math.abs(normalizedNormal.x) > Math.abs(normalizedNormal.z),
            isYAxis:
                Math.abs(normalizedNormal.y) > Math.abs(normalizedNormal.x) &&
                Math.abs(normalizedNormal.y) > Math.abs(normalizedNormal.z),
            isZAxis:
                Math.abs(normalizedNormal.z) > Math.abs(normalizedNormal.x) &&
                Math.abs(normalizedNormal.z) > Math.abs(normalizedNormal.y),
        };

        let rotationAngle, directionSign, finalRotation;

        if (dominantAxis.isXAxis) {
            rotationAngle = Math.atan2(mouseDirection.y, mouseDirection.z);
            directionSign = Math.sign(normalizedNormal.x);
            rotationAngle *= -directionSign;
            finalRotation = rotationAngle;
            finalRotation =
                normalizedNormal.x < 0
                    ? finalRotation
                    : finalRotation + Math.PI;
        } else if (dominantAxis.isZAxis) {
            rotationAngle = Math.atan2(mouseDirection.y, mouseDirection.x);
            directionSign = Math.sign(normalizedNormal.z);
            rotationAngle *= directionSign;
            finalRotation = rotationAngle;
            finalRotation =
                normalizedNormal.z < 0
                    ? finalRotation + Math.PI
                    : finalRotation;
        } else if (dominantAxis.isYAxis) {
            rotationAngle = Math.atan2(mouseDirection.x, mouseDirection.z);
            directionSign = Math.sign(normalizedNormal.y);
            rotationAngle *= directionSign;
            if (normalizedNormal.z > 0) {
                finalRotation = rotationAngle - Math.PI / 2;
            } else {
                finalRotation = rotationAngle + Math.PI / 2;
            }
        } else {
            console.warn(
                'No dominant axis found for plane normal',
                planeNormal,
            );
            finalRotation = 0;
        }

        return finalRotation;
    };

    static upLiftAPointIntheDirectionOfNormal(point, normal, scalar = 0.05) {
        const dummyObject = new THREE.Object3D();
        dummyObject.position.copy(point);
        const normalForDummy = normal.clone().normalize();
        dummyObject.lookAt(normalForDummy);
        const euler = new THREE.Euler();
        euler.setFromQuaternion(dummyObject.quaternion);
        const newPoint = point
            .clone()
            .add(normalForDummy.clone().multiplyScalar(scalar));
        return newPoint;
    }
}
