import React, {useState} from 'react'
import {useAppSelector, useAppDispatch} from '../store/hooks'
import {
    decrement,
    increment,
    incrementAsync,
    incrementByAmount,
    decrementByAmount,
    decrementAsync,
    selectCount
} from '../store/counterSlice'
import styles from './Counter.module.css'

export function Counter() {
    const count = useAppSelector((state) => state.counter.value)
    const [incrementAmount, setIncrementAmount] = useState('2');
    const [decrementAmount, setDecrementAmount] = useState('2');
    const dispatch = useAppDispatch()

    return (
        <div>
            <div className={styles.row}>
                <button className={styles.button}
                        aria-label="Increment value"
                        onClick={() => dispatch(increment())}
                >
                    +
                </button>
                <span>{count}</span>
                <button className={styles.button}
                        aria-label="Decrement value"
                        onClick={() => dispatch(decrement())}
                >
                    -
                </button>
            </div>
            <div className={styles.row}>
                <input
                    className={styles.textbox}
                    aria-label="Set increment amount"
                    value={incrementAmount}
                    onChange={e => setIncrementAmount(e.target.value)}
                />
                <button
                    className={styles.button}
                    onClick={() =>
                        dispatch(incrementByAmount(Number(incrementAmount) || 0))
                    }
                >
                    Add Amount
                </button>
                <button
                    className={styles.asyncButton}
                    onClick={() => dispatch(incrementAsync(Number(incrementAmount) || 0))}
                >
                    Add Async
                </button>
            </div>
            <div className={styles.row}>
                <input
                    className={styles.textbox}
                    aria-label="Set decrement amount"
                    value={decrementAmount}
                    onChange={e => setDecrementAmount(e.target.value)}
                />
                <button
                    className={styles.button}
                    onClick={() =>
                        dispatch(decrementByAmount(Number(decrementAmount) || 0))
                    }
                >
                    Sub Amount
                </button>
                <button
                    className={styles.asyncButton}
                    onClick={() => dispatch(decrementAsync(Number(decrementAmount) || 0))}
                >
                    Sub Async
                </button>
            </div>
        </div>
    )
}
