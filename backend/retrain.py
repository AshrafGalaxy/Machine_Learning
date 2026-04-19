"""
Aegis ML Retrainer — FULL DATASET
Trains on ALL 1,520,967 Python rows from travis_torrent_final_2017.csv.
Estimated time: 20-40 minutes depending on CPU cores.
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib
import time
import warnings
warnings.filterwarnings('ignore')

CSV_PATH  = r"C:\Users\Ashraf\Desktop\ML_CP\travis_torrent_final_2017.csv"
MODEL_OUT = "travis_python_risk_predictor.pkl"
CHUNK_SIZE = 100000

FEATURES = [
    'gh_team_size',
    'git_diff_src_churn',
    'git_diff_test_churn',
    'gh_diff_files_modified',
    'gh_diff_files_added',
    'gh_sloc',
    'gh_is_pr',
    'gh_by_core_team_member'
]

print("=" * 60)
print("  Aegis ML Full Retraining — ALL Python Rows")
print("=" * 60)
print(f"\nPhase 1/3: Reading entire dataset (3.88M rows)...")
t0 = time.time()

chunks = []
total_scanned = 0
total_python  = 0
chunk_num     = 0

for chunk in pd.read_csv(CSV_PATH, chunksize=CHUNK_SIZE, low_memory=False):
    chunk_num += 1
    total_scanned += len(chunk)
    py_rows = chunk[chunk['gh_lang'].astype(str).str.lower() == 'python']
    if len(py_rows) > 0:
        chunks.append(py_rows[FEATURES + ['tr_status']].copy())
    total_python += len(py_rows)
    if chunk_num % 5 == 0:
        elapsed = time.time() - t0
        print(f"  Chunk {chunk_num:3d} | Scanned: {total_scanned:>9,} rows | Python: {total_python:>9,} | {elapsed:.0f}s elapsed")

read_time = time.time() - t0
print(f"\n  Done! Read {total_scanned:,} rows in {read_time:.1f}s")
print(f"  Total Python rows collected: {total_python:,}")

print("\nPhase 2/3: Cleaning and splitting data...")
df = pd.concat(chunks, ignore_index=True)
del chunks  # free memory immediately

# Keep only passed/failed
df = df[df['tr_status'].isin(['passed', 'failed'])].copy()
print(f"  Rows with valid tr_status: {len(df):,}")

y = df['tr_status'].apply(lambda x: 1 if x == 'failed' else 0)
X = df[FEATURES].copy()
del df  # free memory

X['gh_is_pr']               = pd.to_numeric(X['gh_is_pr'], errors='coerce').fillna(0).astype(int)
X['gh_by_core_team_member'] = pd.to_numeric(X['gh_by_core_team_member'], errors='coerce').fillna(0).astype(int)
X = X.fillna(0)

print(f"\nClass distribution:")
print(f"  Passed (0): {(y==0).sum():,}  |  Failed (1): {(y==1).sum():,}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"\n  Train: {len(X_train):,} rows | Test: {len(X_test):,} rows")

print("\nPhase 3/3: Training RandomForest (100 trees, all CPU cores)...")
print("  This will take 20-40 minutes. Progress updates every minute...\n")

t1 = time.time()
model = RandomForestClassifier(
    n_estimators=100,     # 100 trees — optimal for 1M+ rows
    max_depth=20,
    min_samples_split=10,
    min_samples_leaf=4,
    class_weight='balanced',
    n_jobs=-1,            # use ALL CPU cores
    random_state=42,
    verbose=1             # prints progress as trees are built
)
model.fit(X_train, y_train)
train_time = time.time() - t1

print(f"\n  Training complete in {train_time/60:.1f} minutes!")

print("\n" + "=" * 60)
print("  RESULTS")
print("=" * 60)
preds    = model.predict(X_test)
accuracy = accuracy_score(y_test, preds)
print(f"\n  Accuracy: {accuracy * 100:.2f}%")
print("\nDetailed Report (0=Passed, 1=Failed):")
print(classification_report(y_test, preds))

print("Feature Importances (ranked by impact):")
for f, i in sorted(zip(FEATURES, model.feature_importances_), key=lambda x: x[1], reverse=True):
    bar = '#' * int(i * 50)
    print(f"  {f:35s}: {bar} {i*100:.2f}%")

joblib.dump(model, MODEL_OUT)
total_time = time.time() - t0
print(f"\n[OK] Model saved -> {MODEL_OUT}")
print(f"Total elapsed time: {total_time/60:.1f} minutes")
