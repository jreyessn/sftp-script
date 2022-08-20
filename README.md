# Overview

Script Simple para subir archivos por el protocolo SFTP con Nodejs. 

## Version 0.1
- Solo se pueden subir archivos por ahora, no carpetas.
- El script elimina todos los archivos de la carpeta remota excluyendo carpetas y **.htaccess** .

# Instalación
Después de clonar el repositorio instalar las dependencias del proyecto.
```terminal
npm install
```
# Uso básico
### JSON de credenciales
Copiar el archivo `access.example.json` y crear `access.json`

### Propiedades del JSON
El `access.json` debe ser un arreglo de objetos que contengan las siguientes propiedades:
<br>
|Key| Descripción |
|--|--|
| **alias** | Nombre corto del proyecto donde se subirán los archivos |
| **remotePath** | Carpeta raíz del servidor remoto donde se va a montar el build del proyecto. <br> **Ejemplo:** `/home/user/public_html/project/`|
| **localPath** | Carpeta local donde se encuentra el build del proyecto. <br> **Ejemplo:** `/var/www/project/dist/`|
| **credentials** | Credenciales del servidor |
| **credentials.host** | Servidor |
| **credentials.port** | Puerto de Acceso |
| **credentials.user** | Usuario SSH |
| **credentials.password** | Contraseña |

**Ejemplo**

 ```json 
[
	{
		"alias": "MiProyecto",
		"remotePath": "/path/to/dist/",
		"localPath": "/path/to/dist/",
		"credentials": {
			"host": "",
			"port": 22,
			"user": "anonymus",
			"password": "password"
		}
	}
]
```

### Subir archivos
Después de configurar las credenciales de los servidores. Correr el comando:

```terminal
npm run start sv=MiProyecto
```

El `sv=MiProyecto` significa que tomará las credenciales  del alias *MiProyecto* dentro de `access.json` para comenzar a subir los archivos del local a la carpeta remota configurada. 

# Third Party
- Se utilizó el paquete [SSH2-SFTP-Client](https://www.npmjs.com/package/ssh2-sftp-client#orgfef0bf5) para las conexiones.
