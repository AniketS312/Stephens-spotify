const menuItems = [
    'alternative',
    'anime',
    'chill',
    'dance',
    'dancehall',
    'dub',
    'dubstep',
    'garage',
    'grunge',
    'happy',
    'hardstyle',
    'pop',
    'post-dubstep',
    'punk',
    'punk-rock',
    'sad',
    'workout',
    'italian',
    'world-music'
]

const addGenresToInput = async function (items) {
    let transformedArray = [];
    await items.forEach(item => {
        if(item.includes('-') === true ) {
            const newItem = item.split('-')
            let joinedWord = [];
            newItem.forEach(element => {
                let output = element.split('')
                const capitalLetter = output[0].toUpperCase()
                const remainingChars = output.splice(1).join('')
                // console.log(capitalLetter.concat(remainingChars))
                joinedWord.push(capitalLetter.concat(remainingChars))
            })
            transformedArray.push(joinedWord.join(' '))

        } else {
            let output = item.split('')
            const capitalLetter = output[0].toUpperCase()
            const remainingChars = output.splice(1).join('')
            const transformedWord = capitalLetter + remainingChars
            transformedArray.push(transformedWord)
        }
    })
{/* <option value="volvo">volve</option> */}
    await transformedArray.forEach(function(element, index) {
        const optionElement = document.createElement('option')
        optionElement.value = items[index]
        optionElement.innerText = element
        inputComponent.appendChild(optionElement)
    })
}