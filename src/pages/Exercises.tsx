import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

// --- NEW, RELIABLE EXERCISE DATA ---
const EXERCISES: Record<string, Array<{
  name: string;
  description: string;
  steps: string[];
  images: string[];
}>> = {
  shoulders: [
    {
      name: 'Dumbbell Shoulder Press',
      description: 'A compound movement targeting the deltoids.',
      steps: [
        'Sit on a bench with back support.',
        'Hold a dumbbell in each hand at shoulder height.',
        'Press the weights upward until your arms are fully extended.',
        'Lower back to the starting position.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Shoulders_DumbbellShoulderPress_Female.gif']
    },
    {
      name: 'Lateral Raise',
      description: 'Isolates the lateral deltoid for shoulder width.',
      steps: [
        'Stand with a dumbbell in each hand at your sides.',
        'Raise your arms out to the sides until they are parallel to the floor.',
        'Lower slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Shoulders_LateralRaise_Female.gif']
    },
    {
      name: 'Front Raise',
      description: 'Targets the anterior deltoid.',
      steps: [
        'Stand with dumbbells in front of your thighs.',
        'Raise the weights in front of you to shoulder height.',
        'Lower slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Shoulders_FrontRaise_Female.gif']
    },
    {
      name: 'Arnold Press',
      description: 'A variation of the shoulder press for all deltoid heads.',
      steps: [
        'Sit with dumbbells at shoulder height, palms facing you.',
        'Rotate palms outward as you press up.',
        'Lower and rotate back to start.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Shoulders_ArnoldPress_Female.gif']
    },
    {
      name: 'Upright Row',
      description: 'Targets the lateral deltoids and traps.',
      steps: [
        'Hold a barbell in front of your thighs.',
        'Pull the bar up to your chest, elbows high.',
        'Lower slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Shoulders_UprightRow_Female.gif']
    },
    {
      name: 'Face Pull',
      description: 'Great for rear delts and shoulder health.',
      steps: [
        'Set a rope at upper chest height on a cable machine.',
        'Pull the rope towards your face, elbows high.',
        'Squeeze and return.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Shoulders_FacePull_Female.gif']
    },
    {
      name: 'Rear Delt Fly',
      description: 'Isolates the rear deltoids.',
      steps: [
        'Bend at the hips with dumbbells hanging down.',
        'Raise arms out to the sides.',
        'Lower slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Shoulders_ReverseFly_Female.gif']
    },
    {
      name: 'Seated Dumbbell Press',
      description: 'Classic shoulder builder.',
      steps: [
        'Sit upright with dumbbells at shoulder height.',
        'Press overhead until arms are extended.',
        'Lower to start.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Shoulders_DumbbellShoulderPress_Female.gif']
    }
  ],
  chest: [
    {
      name: 'Barbell Bench Press',
      description: 'Classic chest builder for mass and strength.',
      steps: [
        'Lie on a flat bench and grip the bar slightly wider than shoulder-width.',
        'Lower the bar to your chest.',
        'Press it back up to the starting position.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Chest_BarbellBenchPress_Female.gif']
    },
    {
      name: 'Push-Up',
      description: 'Bodyweight exercise for chest, triceps, and shoulders.',
      steps: [
        'Place hands slightly wider than shoulder-width on the floor.',
        'Lower your body until your chest nearly touches the floor.',
        'Push back up.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Chest_Pushup_Female.gif']
    },
    {
      name: 'Incline Dumbbell Press',
      description: 'Targets the upper chest.',
      steps: [
        'Set a bench to a 30-45 degree incline.',
        'Press dumbbells from chest to overhead.',
        'Lower slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Chest_InclineDumbbellPress_Female.gif']
    },
    {
      name: 'Decline Bench Press',
      description: 'Emphasizes the lower chest.',
      steps: [
        'Lie on a decline bench.',
        'Lower bar to lower chest.',
        'Press up.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Chest_DeclineBarbellBenchPress_Female.gif']
    },
    {
      name: 'Chest Fly',
      description: 'Isolates the chest muscles.',
      steps: [
        'Lie on a flat bench with dumbbells.',
        'Lower arms out to sides, slight bend in elbows.',
        'Bring arms together above chest.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Chest_DumbbellFly_Female.gif']
    },
    {
      name: 'Cable Crossover',
      description: 'Great for chest contraction.',
      steps: [
        'Set cables above head height.',
        'Bring handles together in front of chest.',
        'Return slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Chest_CableCrossover_Female.gif']
    },
    {
      name: 'Dips',
      description: 'Bodyweight exercise for lower chest and triceps.',
      steps: [
        'Hold parallel bars and lower body by bending elbows.',
        'Push back up.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Chest_Dip_Female.gif']
    },
    {
      name: 'Machine Chest Press',
      description: 'Machine-based chest press for stability.',
      steps: [
        'Sit at a chest press machine.',
        'Press handles forward.',
        'Return slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Chest_MachineChestPress_Female.gif']
    }
  ],
  abs: [
    {
      name: 'Crunch',
      description: 'Targets the upper abdominals.',
      steps: [
        'Lie on your back with knees bent.',
        'Curl your shoulders towards your pelvis.',
        'Lower back down.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Abs_Crunch_Female.gif']
    },
    {
      name: 'Plank',
      description: 'Isometric core exercise.',
      steps: [
        'Get into a forearm plank position.',
        'Keep your body in a straight line.',
        'Hold for as long as possible.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Abs_Plank_Female.gif']
    },
    {
      name: 'Hanging Leg Raise',
      description: 'Targets the lower abs.',
      steps: [
        'Hang from a pull-up bar.',
        'Raise your legs to hip height.',
        'Lower slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Abs_HangingLegRaise_Female.gif']
    },
    {
      name: 'Russian Twist',
      description: 'Works the obliques and core.',
      steps: [
        'Sit on the floor, lean back slightly.',
        'Twist torso side to side holding a weight.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Abs_RussianTwist_Female.gif']
    }
  ],
  biceps: [
    {
      name: 'Dumbbell Curl',
      description: 'Isolation exercise for the biceps.',
      steps: [
        'Stand with a dumbbell in each hand.',
        'Curl the weights up while keeping your elbows stationary.',
        'Lower back down.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Biceps_DumbbellCurl_Female.gif']
    },
    {
      name: 'Hammer Curl',
      description: 'Targets the brachialis and biceps.',
      steps: [
        'Hold dumbbells with palms facing your torso.',
        'Curl the weights while keeping your palms facing each other.',
        'Lower back down.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Biceps_HammerCurl_Female.gif']
    },
    {
      name: 'Barbell Curl',
      description: 'Classic biceps builder.',
      steps: [
        'Stand with a barbell at thigh level.',
        'Curl the bar up to shoulder height.',
        'Lower slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Biceps_BarbellCurl_Female.gif']
    },
    {
      name: 'Concentration Curl',
      description: 'Isolates the biceps peak.',
      steps: [
        'Sit and brace your elbow against your thigh.',
        'Curl the dumbbell up.',
        'Lower slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Biceps_ConcentrationCurl_Female.gif']
    }
  ],
  triceps: [
    {
      name: 'Triceps Pushdown',
      description: 'Cable exercise for triceps.',
      steps: [
        'Stand at a cable machine with a straight bar.',
        'Push the bar down until your arms are fully extended.',
        'Return to the starting position.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Triceps_TricepsPushdown_Female.gif']
    },
    {
      name: 'Overhead Triceps Extension',
      description: 'Stretches and works the long head of the triceps.',
      steps: [
        'Hold a dumbbell overhead with both hands.',
        'Lower the weight behind your head.',
        'Extend your arms back up.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Triceps_OverheadTricepsExtension_Female.gif']
    },
    {
      name: 'Skullcrusher',
      description: 'Targets the triceps long head.',
      steps: [
        'Lie on a bench with an EZ bar.',
        'Lower the bar to your forehead.',
        'Extend arms back up.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Triceps_Skullcrusher_Female.gif']
    },
    {
      name: 'Bench Dip',
      description: 'Bodyweight triceps exercise.',
      steps: [
        'Place hands behind you on a bench.',
        'Lower your body by bending elbows.',
        'Push back up.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Triceps_BenchDip_Female.gif']
    }
  ],
  back: [
    {
      name: 'Pull-Up',
      description: 'Bodyweight exercise for the lats and upper back.',
      steps: [
        'Hang from a pull-up bar with an overhand grip.',
        'Pull your chin above the bar.',
        'Lower back down.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Back_Pullup_Female.gif']
    },
    {
      name: 'Seated Row',
      description: 'Cable exercise for the middle back.',
      steps: [
        'Sit at a cable row machine.',
        'Pull the handle towards your torso.',
        'Slowly return to the starting position.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Back_SeatedRow_Female.gif']
    },
    {
      name: 'Lat Pulldown',
      description: 'Targets the lats and upper back.',
      steps: [
        'Sit at a lat pulldown machine.',
        'Pull the bar to your chest.',
        'Return slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Back_LatPulldown_Female.gif']
    },
    {
      name: 'Bent Over Row',
      description: 'Compound movement for the back.',
      steps: [
        'Hold a barbell with a pronated grip.',
        'Bend at the hips and knees.',
        'Row the bar to your torso.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Back_BarbellRow_Female.gif']
    },
    {
      name: 'Single Arm Dumbbell Row',
      description: 'Unilateral back exercise.',
      steps: [
        'Place one knee and hand on a bench.',
        'Row a dumbbell to your hip.',
        'Lower slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Back_SingleArmDumbbellRow_Female.gif']
    },
    {
      name: 'T-Bar Row',
      description: 'Targets the mid-back.',
      steps: [
        'Stand over a T-bar row machine.',
        'Pull the handle to your chest.',
        'Lower slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Back_TBarRow_Female.gif']
    },
    {
      name: 'Face Pull',
      description: 'Great for rear delts and upper back.',
      steps: [
        'Set a rope at upper chest height on a cable machine.',
        'Pull the rope towards your face, elbows high.',
        'Squeeze and return.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Shoulders_FacePull_Female.gif']
    },
    {
      name: 'Deadlift',
      description: 'Full-body movement, great for back and posterior chain.',
      steps: [
        'Stand with feet hip-width apart.',
        'Grip the bar and lift by extending hips and knees.',
        'Lower with control.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Back_Deadlift_Female.gif']
    }
  ],
  glutes: [
    {
      name: 'Hip Thrust',
      description: 'Targets the gluteus maximus.',
      steps: [
        'Sit on the ground with your upper back against a bench.',
        'Roll a barbell over your hips.',
        'Thrust your hips upward.',
        'Lower back down.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Glutes_HipThrust_Female.gif']
    },
    {
      name: 'Glute Bridge',
      description: 'Bodyweight exercise for glutes and hamstrings.',
      steps: [
        'Lie on your back with knees bent.',
        'Lift your hips towards the ceiling.',
        'Lower back down.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Glutes_GluteBridge_Female.gif']
    },
    {
      name: 'Cable Kickback',
      description: 'Isolates the glutes.',
      steps: [
        'Attach an ankle strap to a low cable.',
        'Kick your leg back, squeezing the glute.',
        'Return slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Glutes_CableKickback_Female.gif']
    },
    {
      name: 'Bulgarian Split Squat',
      description: 'Unilateral leg and glute exercise.',
      steps: [
        'Place one foot behind you on a bench.',
        'Lower your body until your front thigh is parallel to the floor.',
        'Push back up.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Legs_BulgarianSplitSquat_Female.gif']
    }
  ],
  legs: [
    {
      name: 'Squat',
      description: 'Compound movement for quads, glutes, and hamstrings.',
      steps: [
        'Stand with feet shoulder-width apart.',
        'Lower your body as if sitting back into a chair.',
        'Push through your heels to stand back up.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Legs_BarbellSquat_Female.gif']
    },
    {
      name: 'Lunge',
      description: 'Works quads, glutes, and hamstrings.',
      steps: [
        'Step forward with one leg and lower your hips.',
        'Push back to the starting position.',
        'Repeat on the other leg.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Legs_Lunge_Female.gif']
    },
    {
      name: 'Leg Press',
      description: 'Machine-based compound leg exercise.',
      steps: [
        'Sit on a leg press machine.',
        'Push the platform away with your feet.',
        'Return slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Legs_LegPress_Female.gif']
    },
    {
      name: 'Leg Extension',
      description: 'Isolates the quadriceps.',
      steps: [
        'Sit on a leg extension machine.',
        'Extend your legs.',
        'Lower slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Legs_LegExtension_Female.gif']
    },
    {
      name: 'Leg Curl',
      description: 'Isolates the hamstrings.',
      steps: [
        'Lie face down on a leg curl machine.',
        'Curl your legs up.',
        'Lower slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Legs_LegCurl_Female.gif']
    },
    {
      name: 'Bulgarian Split Squat',
      description: 'Unilateral leg and glute exercise.',
      steps: [
        'Place one foot behind you on a bench.',
        'Lower your body until your front thigh is parallel to the floor.',
        'Push back up.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Legs_BulgarianSplitSquat_Female.gif']
    },
    {
      name: 'Calf Raise',
      description: 'Isolates the calf muscles.',
      steps: [
        'Stand on a raised surface with heels hanging off.',
        'Raise your heels as high as possible.',
        'Lower slowly.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Legs_CalfRaise_Female.gif']
    },
    {
      name: 'Romanian Deadlift',
      description: 'Targets hamstrings and glutes.',
      steps: [
        'Hold a barbell at hip level.',
        'Lower the bar by pushing hips back.',
        'Return to standing.'
      ],
      images: ['https://assets.musclewiki.com/media/uploads/exercise-images/Legs_RomanianDeadlift_Female.gif']
    }
  ]
};

// SVG paths for each muscle group (simplified, but more realistic)
const MUSCLE_SVG_PATHS = {
  front: {
    chest: 'M120,120 C140,90 180,90 200,120 C210,150 190,170 160,170 C130,170 110,150 120,120 Z',
    abs: 'M145,170 C155,180 165,180 175,170 C175,210 165,230 155,210 C145,190 145,170 145,170 Z',
    biceps: 'M100,130 C110,120 120,140 110,150 C100,160 90,140 100,130 Z',
    shoulders: 'M120,90 C130,70 170,70 180,90 C170,110 130,110 120,90 Z',
    legs: 'M140,230 C150,250 170,250 180,230 C185,270 175,320 155,320 C135,320 125,270 140,230 Z',
  },
  back: {
    back: 'M120,120 C140,90 180,90 200,120 C210,150 190,170 160,170 C130,170 110,150 120,120 Z',
    triceps: 'M220,130 C210,120 200,140 210,150 C220,160 230,140 220,130 Z',
    glutes: 'M145,170 C155,180 165,180 175,170 C175,210 165,230 155,210 C145,190 145,170 145,170 Z',
    legs: 'M140,230 C150,250 170,250 180,230 C185,270 175,320 155,320 C135,320 125,270 140,230 Z',
  }
};

const MuscleSVG = ({ view, selected, onSelect, animating }) => (
  <motion.svg
    width={320}
    height={480}
    viewBox="0 0 320 480"
    className="drop-shadow-lg"
    initial={false}
    animate={{ rotateY: animating ? 180 : 0 }}
    transition={{ duration: 0.6 }}
    style={{ transformStyle: 'preserve-3d' }}
  >
    {/* Outline (simple human body shape) */}
    <path d="M80,60 Q160,10 240,60 Q280,240 160,470 Q40,240 80,60 Z" fill="#f3f4f6" stroke="#222" strokeWidth="2" />
    {/* Muscle groups */}
    {(Object.entries(MUSCLE_SVG_PATHS[view]) as [string, string][]).map(([key, d]) => (
      <path
        key={key}
        d={d}
        fill={selected === key ? '#fbbf24' : '#e0e7ef'}
        stroke="#b45309"
        strokeWidth={selected === key ? 4 : 2}
        style={{ cursor: 'pointer', opacity: selected === key ? 1 : 0.7 }}
        onClick={() => onSelect(key)}
      />
    ))}
  </motion.svg>
);

const Exercises = () => {
  const [view, setView] = useState('front');
  const [selectedPart, setSelectedPart] = useState('chest');
  const [animating, setAnimating] = useState(false);

  const handleRotate = () => {
    setAnimating(true);
    setTimeout(() => {
      if (view === 'front') {
        setView('back');
        setSelectedPart('back');
      } else {
        setView('front');
        setSelectedPart('chest');
      }
      setAnimating(false);
    }, 600);
  };

  const exercises = EXERCISES[selectedPart] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navigation />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-2">Exercise Explorer</h1>
        <p className="text-center text-gray-500 mb-6">Select a muscle group to see exercises.</p>
        <div className="text-center mb-6">
          <Button onClick={handleRotate} variant="default">{view === 'front' ? 'Show Back' : 'Show Front'}</Button>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <AnimatePresence mode="wait">
            <MuscleSVG
              key={view}
              view={view}
              selected={selectedPart}
              onSelect={setSelectedPart}
              animating={animating}
            />
          </AnimatePresence>
          <div className="flex-1 w-full max-w-md">
            <Card className="h-[500px]">
              <CardHeader>
                <CardTitle className="text-xl capitalize">{selectedPart} Exercises</CardTitle>
              </CardHeader>
              <CardContent className="h-full overflow-y-auto">
                {exercises.map((ex, idx) => (
                  <motion.div
                    key={ex.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="mb-8"
                  >
                    <div className="flex flex-col items-center mb-2">
                      <img
                        src={ex.images[0]}
                        alt={ex.name}
                        className="w-32 h-32 object-contain rounded-lg border shadow bg-white mb-2"
                      />
                      <div className="font-bold text-lg mb-1 text-center">{ex.name}</div>
                      <div className="text-gray-600 mb-2 text-center text-sm">{ex.description}</div>
                    </div>
                    <ol className="list-decimal list-inside text-sm text-gray-700 pl-4">
                      {ex.steps.map((step, i) => <li key={i}>{step}</li>)}
                    </ol>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Exercises;