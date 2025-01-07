import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const BateauGame = () => {
  const [level, setLevel] = useState(1);
  const [persons, setPersons] = useState([]);
  const [boats, setBoats] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [draggedPerson, setDraggedPerson] = useState(null);

  useEffect(() => {
    startLevel(level);
  }, [level]);

  const startLevel = (currentLevel) => {
    // Génération des personnes
    const totalPersons = currentLevel * 3;
    const newPersons = Array(totalPersons).fill(null).map((_, index) => ({
      id: `person-${index}`,
      boatId: null
    }));

    // Génération des bateaux
    const boatsCount = Math.ceil(totalPersons / currentLevel);
    const newBoats = Array(boatsCount).fill(null).map((_, index) => ({
      id: `boat-${index}`,
      capacity: currentLevel,
      persons: []
    }));

    setPersons(newPersons);
    setBoats(newBoats);
    setIsGameOver(false);
    setShowSuccess(false);
  };

  const handleDragStart = (e, personId) => {
    setDraggedPerson(personId);
  };

  const handleDrop = (e, boatId) => {
    e.preventDefault();
    const boat = boats.find(b => b.id === boatId);
    if (!boat || boat.persons.length >= boat.capacity) return;

    const updatedBoats = boats.map(b => {
      if (b.id === boatId) {
        return {
          ...b,
          persons: [...b.persons, draggedPerson]
        };
      }
      return b;
    });

    const updatedPersons = persons.map(p => {
      if (p.id === draggedPerson) {
        return { ...p, boatId };
      }
      return p;
    });

    setBoats(updatedBoats);
    setPersons(updatedPersons);
    checkWinCondition(updatedBoats);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const checkWinCondition = (currentBoats) => {
    const allPersonsPlaced = persons.every(p => p.boatId);
    const validDistribution = currentBoats.every(b => 
      b.persons.length === b.capacity || b.persons.length === 0
    );

    if (allPersonsPlaced && validDistribution) {
      setShowSuccess(true);
    }
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
  };

  const restartGame = () => {
    setLevel(1);
    startLevel(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Niveau {level}
        </h1>

        {/* Zone des personnes non placées */}
        <div className="bg-white/20 p-4 rounded-lg mb-8">
          <h2 className="text-xl text-white mb-4">Personnes à placer</h2>
          <div className="flex flex-wrap gap-2">
            {persons.filter(p => !p.boatId).map(person => (
              <div
                key={person.id}
                draggable
                onDragStart={(e) => handleDragStart(e, person.id)}
                className="w-8 h-8 bg-red-500 rounded-full cursor-move"
              />
            ))}
          </div>
        </div>

        {/* Zone des bateaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boats.map(boat => (
            <div
              key={boat.id}
              onDrop={(e) => handleDrop(e, boat.id)}
              onDragOver={handleDragOver}
              className="bg-blue-500/50 p-4 rounded-lg min-h-32"
            >
              <h3 className="text-white mb-2">
                Bateau ({boat.persons.length}/{boat.capacity})
              </h3>
              <div className="flex flex-wrap gap-2">
                {boat.persons.map(personId => (
                  <div
                    key={personId}
                    className="w-8 h-8 bg-red-500 rounded-full"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dialogue de succès */}
        <AlertDialog open={showSuccess}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Félicitations ! Niveau {level} complété !
              </AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex justify-end space-x-4">
              <button
                onClick={nextLevel}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Niveau suivant
              </button>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* Game Over Dialog */}
        <AlertDialog open={isGameOver}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Game Over!</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="flex justify-end space-x-4">
              <button
                onClick={restartGame}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Recommencer
              </button>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default BateauGame;