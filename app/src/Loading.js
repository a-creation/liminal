import loading from './assets/loading.gif'
import icon from './assets/liminal.png'

function LoadingScreen() {
    return (
        <div
            style={{backgroundColor:'transparent', height:"2000px"}}
        >
            <img 
                src="https://flevix.com/wp-content/uploads/2019/07/Curve-Loading.gif" 
                alt="loading..."
                style={{
                    textAlign:'center',
                    marginTop:'325px'
                }}
            />
        </div>
    )
}

export default LoadingScreen;