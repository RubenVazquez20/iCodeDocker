#CQ0000000000000000001
number = int(input())
result = number * 2
print(result)

#CQ0000000000000000002
"3"

#CQ0000000000000000003
a = float(input())
b = float(input())
result = a + b
print(result)

#CQ0000000000000000004
"1"

#CQ0000000000000000005
n = int(input())
result = 1
for i in range(1, n + 1):
    result *= i
print(result)

#CQ0000000000000000006
"Hello, Alice"

#CQ0000000000000000007
n = int(input())
a, b = 0, 1
if n <= 2:
    for i in range(n):
        print(a)
        a, b = b, a + b
else:
    print(a)
    print(b)
    for _ in range(n - 2):
        a, b = b, a + b
        print(b)


#CQ0000000000000000008
"15"

#CQ0000000000000000009
numbers = input().split()
numbers = [float(num) for num in numbers]
total = sum(numbers)
average = total / len(numbers)
print(average)

#CQ0000000000000000010
"3"

#CQ0000000000000000011
number = int(input())
square = number ** 2
print(square)

#CQ0000000000000000012
"16"

#CQ0000000000000000013
length = float(input())
width = float(input())
area = length * width
print(area)

#CQ0000000000000000014
"4"

#CQ0000000000000000015
word = input()
word = word.replace(" ", "").lower()
if word == word[::-1]:
    print("True")
else:
    print("False")
    
#CQ0000000000000000016
"1"

#CQ0000000000000000017
n = int(input())
factorial = 1
for i in range(1, n + 1):
    factorial *= i
print(factorial)

#CQ0000000000000000018
"[5, 4, 3, 2, 1]"

#CQ0000000000000000019
string = input()
vowels = 'aeiouAEIOU'
count = 0
for char in string:
    if char in vowels:
        count += 1
print(count)

#CQ0000000000000000020
"4"

#CQ0000000000000000021
number = int(input())
if number <= 1:
    is_prime = False
else:
    is_prime = True
    for i in range(2, int(number**0.5) + 1):
        if number % i == 0:
            is_prime = False
            break
print(is_prime)

#CQ0000000000000000022
"0", "1", "2"

#CQ0000000000000000023
numbers = input().split()
numbers = [int(num) for num in numbers]
sum_result = 0
for number in numbers:
    sum_result += number
print(sum_result)

#CQ0000000000000000024
"4"

#CQ0000000000000000025
string = input()
reversed_string = ''
for char in string:
    reversed_string = char + reversed_string
print(reversed_string)

#CQ0000000000000000026
"9"

#CQ0000000000000000027
n = int(input())
sequence = [0, 1]
if n <= 1:
    sequence = sequence[:n + 1]
else:
    while len(sequence) <= n:
        next_number = sequence[-1] + sequence[-2]
        sequence.append(next_number)
print(sequence)

#CQ0000000000000000028
"Hello, world!"

#CQ0000000000000000029
numbers = input().split()
numbers = [int(num) for num in numbers]
if not numbers:
    maximum = None
else:
    maximum = numbers[0]
    for number in numbers:
        if number > maximum:
            maximum = number
print(maximum)

#CQ0000000000000000030
"2"

#CQ0000000000000000031
str1 = input()
str2 = input()
str1 = str1.lower().replace(" ", "")
str2 = str2.lower().replace(" ", "")
if len(str1) != len(str2):
    is_anagram = False
else:
    char_count = {}
    for char in str1:
        if char in char_count:
            char_count[char] += 1
        else:
            char_count[char] = 1
    for char in str2:
        if char in char_count and char_count[char] > 0:
            char_count[char] -= 1
        else:
            is_anagram = False
            break
    else:
        is_anagram = True
print(is_anagram)

#CQ0000000000000000032
"x is greater than 5"

#CQ0000000000000000033
numbers = input().split()
numbers = [int(num) for num in numbers]
if len(numbers) == 0:
    average = 0
else:
    total = sum(numbers)
    average = total / len(numbers)
print(average)

#CQ0000000000000000034
"4"

#CQ0000000000000000035
number = int(input())
is_even = number % 2 == 0
print(is_even)

#CQ0000000000000000036
"4"

#CQ0000000000000000037
numbers = input().split()
numbers = [int(num) for num in numbers]
largest = float('-inf')
second_largest = float('-inf')
for num in numbers:
    if num > largest:
        second_largest = largest
        largest = num
    elif num > second_largest and num != largest:
        second_largest = num
print(second_largest)

#CQ0000000000000000038
"4"

#CQ0000000000000000039
lst = input().split()
unique_lst = list(set(lst))
unique_lst.sort()
print(unique_lst)

#CQ0000000000000000040
"8"

#CQ0000000000000000041
lst = input().split()
item = input()
count = 0
for element in lst:
    if element == item:
        count += 1
print(count)

#CQ0000000000000000042
"2"

#CQ0000000000000000043
n = int(input())
factorial = 1
for i in range(1, n + 1):
    factorial *= i
print(factorial)

#CQ0000000000000000044
n = int(input())
is_prime = True
if n <= 1:
    is_prime = False
else:
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            is_prime = False
            break
print(is_prime)

#CQ0000000000000000045
"int"

#CQ0000000000000000046
text = input()
text = text.replace(" ", "").lower()
is_palindrome = text == text[::-1]
print(is_palindrome)

#CQ0000000000000000047
"2"

#CQ0000000000000000048
number = input()
number_str = str(number)
digit_sum = 0
for digit in number_str:
    digit_sum += int(digit)
print(digit_sum)

#CQ0000000000000000049
"[1, 2, 3, 4, 5, 6]"

#CQ0000000000000000050
def are_anagrams(str1, str2):
    str1_list = list(str1)
    str2_list = list(str2)
    str1_list.sort()
    str2_list.sort()
    if str1_list == str2_list:
        return True
    else:
        return False

#CQ0000000000000000051
"oh"

#CQ0000000000000000052
a = int(input())
b = int(input())

while b != 0:
    a, b = b, a % b
print(a)

#CQ0000000000000000053
"4"

#CQ0000000000000000054
import math
radio = float(input())
area = math.pi * radio**2
print(area)

#CQ0000000000000000055
"3"

#CQ0000000000000000056
cadena = input()
vocales = 'aeiouAEIOU'
count = 0
for char in cadena:
    if char in vocales:
        count += 1
print(count)

#CQ0000000000000000057
"14"

#CQ0000000000000000058
rango_inicio = int(input())
rango_fin = int(input())
primos = []
for numero in range(rango_inicio, rango_fin + 1):
    if numero < 2:
        continue
    es_primo = True
    for i in range(2, int(numero**0.5) + 1):
        if numero % i == 0:
            es_primo = False
            break
    if es_primo:
        primos.append(numero)
print(primos)

#CQ0000000000000000059
"1"