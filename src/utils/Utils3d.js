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
        const allMeshPositions = mesh.geometry.attributes.position.array;
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
            return;
        }

        const closestPointIndex = allPanelPositionsVectors.findIndex((point) =>
            point.equals(closestPoint),
        );

        const allPanelNormals = mesh.geometry.attributes.normal.array;
        const closestPointNormal = new THREE.Vector3(
            allPanelNormals[closestPointIndex * 3],
            allPanelNormals[closestPointIndex * 3 + 1],
            allPanelNormals[closestPointIndex * 3 + 2],
        );

        return closestPointNormal;
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

    static calculateRotation = (normal, dir) => {
        const axis = {
            x: Math.abs(normal.x) > 0.9,
            y: Math.abs(normal.y) > 0.8,
            z: Math.abs(normal.z) > 0.9,
        };

        let currentAngle, sign, angleDiff;

        if (axis.x) {
            currentAngle = Math.atan2(dir.y, dir.z);
            sign = Math.sign(normal.x);
            currentAngle *= -sign;
            angleDiff = currentAngle;
            angleDiff = normal.x < 0 ? angleDiff : angleDiff + Math.PI;
        } else if (axis.z) {
            currentAngle = Math.atan2(dir.y, dir.x);
            sign = Math.sign(normal.z);
            currentAngle *= sign;
            angleDiff = currentAngle;
            angleDiff = normal.z < 0 ? angleDiff + Math.PI : angleDiff;
        } else if (axis.y) {
            currentAngle = Math.atan2(dir.x, dir.z);
            sign = Math.sign(normal.y);
            currentAngle *= sign;
            if (normal.z > 0) {
                angleDiff = currentAngle - Math.PI / 2;
            } else {
                angleDiff = currentAngle + Math.PI / 2;
            }
        }

        return angleDiff;
    };
}
