import { Component } from '@angular/core';

import { Contact } from '../../components/contact/contact';
import { Faq } from '../../components/faq/faq';
import { FeaturesSection } from '../../components/features/features';
import { Footer } from '../../components/footer/footer';
import { Hero } from '../../components/hero/hero';
import { HowItWorks } from '../../components/how-it-works/how-it-works';
import { Navbar } from '../../components/navbar/navbar';
import { Statistics } from '../../components/statistics/statistics';
import { Teachers } from '../../components/teachers/teachers';
import { Testimonials } from '../../components/testimonials/testimonials';
import { Courses } from '../../components/courses/courses';

@Component({
  selector: 'app-landing-page',
  imports: [
    Hero,
    Statistics,
    FeaturesSection,
    HowItWorks,
    Teachers,
    Testimonials,
    Faq,
    Contact,
    Courses,
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {}
