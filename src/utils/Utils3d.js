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
}
