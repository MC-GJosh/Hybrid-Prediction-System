import numpy as np
from datetime import datetime

def predict_time(time_logs: list):
    if len(time_logs) < 2:
        return None

    # Convert dates to numbers
    dates = []
    times = []

    for log in time_logs:
        date = datetime.strptime(log["log_date"], "%Y-%m-%d")
        dates.append(date.toordinal())
        times.append(float(log["time_seconds"]))

    X = np.array(dates).reshape(-1, 1)
    y = np.array(times)

    # Linear Regression manually
    x_mean = np.mean(X)
    y_mean = np.mean(y)

    numerator = np.sum((X.flatten() - x_mean) * (y - y_mean))
    denominator = np.sum((X.flatten() - x_mean) ** 2)

    if denominator == 0:
        return None

    slope = numerator / denominator
    intercept = y_mean - slope * x_mean

    # Predict 30 days from last log
    last_date = max(dates)
    future_date = last_date + 30

    predicted = slope * future_date + intercept
    best_case = predicted - 0.5
    worst_case = predicted + 0.5

    # Trend
    if slope < -0.01:
        trend = "Improving"
    elif slope > 0.01:
        trend = "Declining"
    else:
        trend = "Stable"

    # Confidence based on data points
    if len(time_logs) >= 5:
        confidence = "High"
    elif len(time_logs) >= 3:
        confidence = "Medium"
    else:
        confidence = "Low"

    # Calculate recent delta and std_deviation
    recent_delta = None
    if len(times) >= 2:
        num_prev = min(3, len(times) - 1)
        prev_times = times[-(num_prev + 1):-1]
        recent_delta = float(round(times[-1] - np.mean(prev_times), 2))
        
    std_deviation = float(round(np.std(times), 2))

    return {
        "predicted_time": float(round(predicted, 2)),
        "best_case": float(round(best_case, 2)),
        "worst_case": float(round(worst_case, 2)),
        "trend": trend,
        "confidence": confidence,
        "slope": float(slope),
        "data_points": len(time_logs),
        "recent_delta": recent_delta,
        "std_deviation": std_deviation
    }