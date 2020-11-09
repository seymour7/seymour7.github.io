---
layout: post
title: The SOLID principles of Object Oriented Design
description: The SOLID design principles helps you to write code that is easy to maintain, extend and understand.
---

### What is SOLID?

SOLID helps you to write code that is easy to maintain, extend and understand.

It is an acronym for the following 5 principles:
{% highlight plaintext %}
S = Single-responsibility principle
O = Open-closed principle
L = Liskov substitution principle
I = Interface segregation principle
D = Dependency inversion principle
{% endhighlight %}

### Single-responsibility principle

* A class/module should only be responsible for one thing.
* A class/module should have only one reason to be changed.

Here's an example that violates this principle:

{% highlight java %}
public class Customer {
    public void add(Database db) {
        try {
            db.execute("INSERT INTO...");
        } catch (Exception e) {
            File.writeAllText("/var/log/error.log", e.toString());
        }
    }
}
{% endhighlight %}

The `Customer` class is responsible for both writing to the database and writing to the logfile.
* If we want to change the way we log errors, `Customer` needs to change.
* If we want to change the way we write to the DB, `Customer` needs to change.

This code should be refactored to:

{% highlight java %}
class Customer {
    private FileLogger logger = new FileLogger();
    void add(Database db) {
        try {
            db.execute("INSERT INTO...");
        } catch (Exception e) {
            logger.log(e.toString());
        }
    }
}
class FileLogger {
    void log(String error) {
        File.writeAllText("/var/log/error.log", error);
    }
}
{% endhighlight %}

Some other examples where you'd need separate classes are: user input validation, authentication, caching.

Be careful not to over-fragment code (creating too many responsibilities). Remember the whole point of SOLID is to make your code easier to maintain.

Further reading:
* https://blog.ndepend.com/solid-design-the-single-responsibility-principle-srp

### Open-closed principle

* Classes/modules should be open for extension but closed for modification
* Rather extend functionality by adding new code instead of changing existing code.
* The goal is to get to a point where you can never break the core of your system.

Here's an example that violates this principle:

{% highlight java %}
public void pay(Request request) {
    Payment payment = new Payment();
    if (request.getType().eq("credit")) {
        payment.payWithCreditCard();
    } else {
        payment.payWithPaypal();
    }
}
public class Payment {
    public void payWithCreditCard() {
        // logic for paying with credit card
    }
    public void payWithPaypal() {
        // logic for paying with paypal
    }
}
{% endhighlight %}

What if we wanted to add a new payment method? We would have to modify the `Payment` class, which violates the open-closed principle.

This code should be refactored to:

{% highlight java %}
public void pay(Request request) {
    PaymentFactory paymentFactory = new PaymentFactory();
    payment = paymentFactory.initialisePayment(request.getType());
    payment.pay();
}
//-----------------------
public class PaymentFactory {
    public Payment intialisePayment(String type) {
        if (type.eq("credit")) {
            return new CreditCardPayment();
        } elseif (type.eq("paypal")) {
            return new PaypalPayment();
        } elseif (type.eq("wire")) {
            return new WirePayment();
        }
        throw new Exception("Unsupported payment method");
    }
}
//-----------------------
interface Payment {
    public void pay();
}
class CreditCardPayment implements Payment {
    public void pay() {
        // logic for paying with credit card
    }
}
class PaypalPayment implements Payment {
    public void pay() {
        // logic for paying with paypal
    }
}
class WirePayment implements Payment {
    public void pay() {
        // logic for paying with wire
    }
}
{% endhighlight %}

Now we can add new payment methods by adding new classes, instead of modifying existing classes.

Further reading:
* https://blog.ndepend.com/solid-design-the-open-close-principle-ocp/

### Liskov substitution principle

If a class implements an interface, it must be able to substitute any reference that implements that same interface.

E.g. if a class called `MySQL` implements `Database`, and another class called `MongoDB` implements `Database`, you should be able to substitute `MySQL` objects for `MongoDB` objects

Here's an example that violates this principle:

{% highlight java %}
public abstract class Bird {
    public abstract void Fly();
}
public class Parrot : Bird {
    public override void Fly() {
        // logic for flying
    }
}
public class Ostrich : Bird {
    public override void Fly() {
         // Can't implement as ostriches can't fly
        throw new NotImplementedException();
    }
}
{% endhighlight %}

The above is a bad design as `Bird` assumes all birds can fly.

This code could then be refactored to:

{% highlight java %}
public abstract class Bird {
}
public abstract class FlyingBird : Bird {
    public abstract void Fly();
}
public class Parrot : FlyingBird {
    public override void Fly() {
        // logic for flying
    }
}
public class Ostrich : Bird {
}
{% endhighlight %}

The gist of this principle is to be careful when using polymorphism and inheritance.

Here is another, more real-world encounter of this principle:
* You have a class called `BankAccount` with a `withdrawal()` method. Do all bank accounts allow withdrawals? A fixed deposit account won't allow withdrawals, for example.

Further reading:
* https://blog.ndepend.com/solid-design-the-liskov-substitution-principle/

### Interface segregation principle

No client should be forced to depend on methods it does not use.

Here's an example that violates this principle:

{% highlight java %}
public interface Athlete {
    void compete();
    void swim();
    void highJump();
    void longJump();
}
public class JohnDoe implements Athlete {
    @Override
    public void compete() {
        System.out.println("John Doe started competing");
    }
    @Override
    public void swim() {
        System.out.println("John Doe started swimming");
    }
    @Override
    public void highJump() {
    }
    @Override
    public void longJump() {
    }
}
{% endhighlight %}

`JohnDoe` is just a swimmer, but is forced to implement methods like `highJump` and `longJump` that he'll never use.

This code could then be refactored to:

{% highlight java %}
public interface Athlete {
    void compete();
}
public interface SwimmingAthlete extends Athlete {
    void swim();
}
public interface JumpingAthlete extends Athlete {
    void highJump();
    void longJump();
}
public class JohnDoe implements SwimmingAthlete {
    @Override
    public void compete() {
        System.out.println("John Doe started competing");
    }
    @Override
    public void swim() {
        System.out.println("John Doe started swimming");
    }
}
{% endhighlight %}

Now, `JohnDoe` does not have to implement actions that he is not capable of performing.

Further reading: 
* https://blog.ndepend.com/solid-design-the-interface-segregation-principle-isp/
* https://dzone.com/articles/solid-principles-interface-segregation-principle

### Dependency inversion principle

* High-level modules should not depend on low-level modules. They should depend on abstractions.
* This allows you to change an implementation easily without altering the high level code.

Here's an example that violates this principle:

{% highlight java %}
public class BackEndDeveloper {
    public void writeJava() {
    }
}
public class FrontEndDeveloper {
    public void writeJavascript() {
    }
}
public class Project {
    private BackEndDeveloper backEndDeveloper = new BackEndDeveloper();
    private FrontEndDeveloper frontEndDeveloper = new FrontEndDeveloper();
    public void implement() {
        backEndDeveloper.writeJava();
        frontEndDeveloper.writeJavascript();
    }
}
{% endhighlight %}

The `Project` class is a high-level module, and it depends on low-level modules such as `BackEndDeveloper` and `FrontEndDeveloper`. This violates the principle.

This code should be refactored to:

{% highlight java %}
public interface Developer {
    void develop();
}
public class BackEndDeveloper implements Developer {
    @Override
    public void develop() {
        writeJava();
    }
    private void writeJava() {
    }
}
public class FrontEndDeveloper implements Developer {
    @Override
    public void develop() {
        writeJavascript();
    }
    public void writeJavascript() {
    }
}
//-----------------------
public class Project {
    private List<Developer> developers;
    public Project(List<Developer> developers) {
        this.developers = developers;
    }
    public void implement() {
        developers.forEach(d -> d.develop());
    }
}
{% endhighlight %}

Now, the `Project` class does not depend on lower level modules, but rather abstractions.

Further reading:
* https://blog.ndepend.com/solid-design-the-dependency-inversion-principle-dip/
* https://dzone.com/articles/solid-principles-dependency-inversion-principle

### Final note: Don't be too strict about SOLID

* SOLID design principles are principles, not rules
* Always use common sense when applying SOLID (know your trade-offs).
* Usually with SOLID, it requires more time writing code, so you can spend less time reading it later.
* Finally, remember to use SOLID as a tool, not as a goal.
