// indexedDB.js
export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("jemsao", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("opportunities", { keyPath: "id" });
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject("Error opening database: " + event.target.errorCode);
    };
  });
};

export const saveOpportunity = async (opportunity) => {
  const db = await openDatabase();
  const transaction = db.transaction("opportunities", "readwrite");
  const objectStore = transaction.objectStore("opportunities");
  objectStore.put(opportunity);

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve("Opportunity saved successfully!");
    };

    transaction.onerror = (event) => {
      reject("Error saving opportunity: " + event.target.errorCode);
    };
  });
};

export const initDatabase = () => {
  const request = indexedDB.open('jemsao', 1); // Remplacez 'myDatabase' par le nom de votre base de données

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    // Créez un object store pour les opportunités
    if (!db.objectStoreNames.contains('opportunities')) {
      db.createObjectStore('opportunities', { keyPath: 'id' }); // 'id' doit être un identifiant unique pour chaque opportunité
    }
  };

  request.onerror = (event) => {
    console.error('Database error:', event);
  };

  request.onsuccess = (event) => {
    console.log('Database initialized successfully');
  };
};

// Appelez cette fonction au début de votre application
initDatabase();


export const getOpportunities = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('jemsao');

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction('opportunities', 'readonly');
      const store = transaction.objectStore('opportunities');
      const getAllRequest = store.getAll(); // Récupérer toutes les opportunités

      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result); // Résoudre avec les résultats
      };

      getAllRequest.onerror = () => {
        reject('Error fetching opportunities');
      };
    };

    request.onerror = () => {
      reject('Database error');
    };
  });
};
export const clearOpportunities = async () => {
  const db = await openDatabase();
  const transaction = db.transaction("opportunities", "readwrite");
  const objectStore = transaction.objectStore("opportunities");
  const request = objectStore.clear();

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      resolve("Opportunities cleared successfully!");
    };

    request.onerror = (event) => {
      reject("Error clearing opportunities: " + event.target.errorCode);
    };
  });
};
